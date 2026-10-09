/**
 * A DOM small enough to reason about, and the loader that runs the client
 * script against it.
 *
 * Hand-rolled rather than jsdom, so the tests run on a bare Node with no
 * install step. Two rules in here are deliberately strict, because both
 * correspond to bugs that shipped: `classList.add('')` throws rather than
 * silently accepting an empty token, and `innerHTML` accepts only the empty
 * string, so a render path cannot quietly start assembling markup from strings.
 */

const fs = require('fs');
const path = require('path');

function makeNode(tag) {
  const node = {
    tagName: String(tag).toUpperCase(),
    children: [],
    style: {},
    className: '',
    title: '',
    colSpan: null,
    type: '',
    value: '',
    disabled: false,
    hidden: false,
    _text: '',
    _listeners: {},
    classList: {
      add: function (name) {
        if (!name) throw new Error('classList.add called with an empty string');
        node.className = (node.className ? node.className + ' ' : '') + name;
      },
      contains: function (name) {
        return node.className.split(' ').indexOf(name) !== -1;
      }
    },
    _attrs: {},
    querySelectorAll: function () { return []; },
    setAttribute: function (name, value) { node._attrs[name] = String(value); },
    getAttribute: function (name) {
      return Object.prototype.hasOwnProperty.call(node._attrs, name) ? node._attrs[name] : null;
    },
    appendChild: function (child) {
      node.children.push(child);
      return child;
    },
    insertBefore: function (child) {
      node.children.unshift(child);
      return child;
    },
    addEventListener: function (type, handler) {
      node._listeners[type] = (node._listeners[type] || []).concat([handler]);
    },
    /** Fires the handlers a real click would, so a test can drive the UI. */
    click: function () {
      (node._listeners.click || []).forEach(function (handler) {
        handler({
          target: node,
          preventDefault: function () {},
          // A button nested inside another clickable cell stops the click
          // reaching it, so the handlers under test call this.
          stopPropagation: function () {}
        });
      });
    },
    set textContent(value) {
      node._text = String(value);
      node.children = [];
    },
    get textContent() {
      return node._text + node.children.map(function (c) { return c.textContent; }).join('');
    },
    set innerHTML(value) {
      if (value !== '') throw new Error('innerHTML used for markup');
      node._text = '';
      node.children = [];
    },
    get firstChild() { return node.children[0] || null; }
  };
  return node;
}

/** Every node the client asked for by id, so assertions can read them back. */
function install() {
  const registry = {};

  global.document = {
    createElement: makeNode,
    createDocumentFragment: function () { return makeNode('fragment'); },
    createTextNode: function (text) {
      const node = makeNode('text');
      node.textContent = text;
      return node;
    },
    getElementById: function (id) {
      if (!registry[id]) registry[id] = makeNode('div');
      return registry[id];
    },
    // Selector lookups share the registry under the selector string, so a test
    // can read back what the client wrote to `[data-def="cloud"] .viz-name`.
    querySelector: function (selector) {
      const key = 'sel:' + selector;
      if (!registry[key]) registry[key] = makeNode('div');
      return registry[key];
    },
    querySelectorAll: function () { return []; },
    addEventListener: function () {}
  };
  global.window = { addEventListener: function () {} };

  return registry;
}

function inlineScript(file) {
  const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  // Skips the charts loader tag, and non-greedy so one block is taken rather
  // than everything between the first and last tag in the file.
  const match = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/);
  if (!match) throw new Error('no inline script block in ' + file);
  return match[1];
}

/**
 * Runs the client script and hands back the named functions.
 *
 * @param {string} version directory holding JavaScript.html
 * @param {!Array<string>} exports names to lift out of the client scope
 */
function loadClient(version, exports) {
  // Same order as Index.html: Formatters, ScopeEngine (carries the DASH_MODES
  // registry and buildScope_), then the client script.
  const source = inlineScript('shared/Formatters.html') + '\n' +
    inlineScript('shared/ScopeEngine.html') + '\n' +
    inlineScript(version + '/JavaScript.html') + '\n' +
    'return {' + exports.map(function (name) {
      return name + ': typeof ' + name + ' === "undefined" ? undefined : ' + name;
    }).join(', ') + '};';

  return new Function(
    'document', 'window', 'google', 'MutationObserver', 'console', source
  )(
    global.document,
    global.window,
    { charts: { load: function () {}, setOnLoadCallback: function () {} } },
    function () { this.observe = function () {}; },
    console
  );
}

module.exports = { makeNode: makeNode, install: install, loadClient: loadClient };
