/**
 * Enough of the Apps Script environment to load the backend into Node.
 *
 * The backend files are written for the Apps Script runtime, which has no
 * module system: every file shares one global scope. Loading them here with
 * `vm.runInThisContext` reproduces that, which is what lets the scope logic be
 * exercised against real BigQuery rows without a deployment round trip.
 *
 * Only the services the backend actually touches are stubbed, and the stubs
 * fail loudly rather than returning plausible empties, so a test cannot pass by
 * accident on a service that was never wired up.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PROPERTIES = {
  BQ_PROJECT: 'elastic-edm-prod',
  BQ_DATASET: 'revops__rpt',
  BQ_BILLING_PROJECT: 'elastic-edm-prod',
  BQ_LOCATION: 'US',
  CACHE_SECONDS: '1800'
};

global.PropertiesService = {
  getScriptProperties: function () {
    return {
      getProperty: function (key) {
        return Object.prototype.hasOwnProperty.call(PROPERTIES, key) ? PROPERTIES[key] : null;
      },
      getProperties: function () { return Object.assign({}, PROPERTIES); },
      // Actually writes, so a test can observe what a setup function like
      // configureAccessGroup() persisted, not just that it ran without error.
      setProperty: function (key, value) {
        PROPERTIES[key] = value;
        return this;
      }
    };
  },
  getUserProperties: function () { return this.getScriptProperties(); }
};

/* An in-process cache, so cache hits and misses behave as they do in the app. */
const cacheStore = {};
const cacheService = {
  get: function (key) { return Object.prototype.hasOwnProperty.call(cacheStore, key) ? cacheStore[key] : null; },
  put: function (key, value) { cacheStore[key] = value; },
  remove: function (key) { delete cacheStore[key]; },
  getAll: function (keys) {
    const out = {};
    keys.forEach(function (key) { if (cacheStore[key] !== undefined) out[key] = cacheStore[key]; });
    return out;
  },
  putAll: function (values) { Object.assign(cacheStore, values); }
};
global.CacheService = {
  getScriptCache: function () { return cacheService; },
  getUserCache: function () { return cacheService; }
};

global.Utilities = {
  gzip: function (blob) { return blob; },
  ungzip: function (blob) { return blob; },
  base64Encode: function (data) { return Buffer.from(String(data)).toString('base64'); },
  base64Decode: function (data) { return Buffer.from(String(data), 'base64'); },
  newBlob: function (data) {
    return {
      getDataAsString: function () { return String(data); },
      getBytes: function () { return Buffer.from(String(data)); }
    };
  },
  formatDate: function (date, tz, format) {
    const iso = new Date(date).toISOString();
    if (format === 'yyyy-MM-dd') return iso.slice(0, 10);
    return iso;
  },
  computeDigest: function (algorithm, value) {
    return require('crypto').createHash('md5').update(String(value)).digest();
  },
  DigestAlgorithm: { MD5: 'MD5' },
  Charset: { UTF_8: 'UTF_8' }
};

global.Session = { getScriptTimeZone: function () { return 'America/Los_Angeles'; } };

global.BigQuery = {
  Jobs: {
    query: function (request, project) {
      if (!bigQueryResponder) {
        throw new Error('BigQuery is not available in the harness; use a fixture');
      }
      return bigQueryResponder(request, project);
    },
    getQueryResults: function () {
      throw new Error('BigQuery is not available in the harness; use a fixture');
    }
  }
};

/** Installs a BigQuery.Jobs.query responder, or clears it when passed nothing. */
let bigQueryResponder = null;
function onBigQuery(responder) { bigQueryResponder = responder || null; }

/**
 * A completed Jobs.query response shaped like SELECT result, status FROM
 * AI.GENERATE(...). Used by narration tests instead of UrlFetch.
 */
function bigQueryAiResponse(text, status, labelsCheck) {
  return {
    jobComplete: true,
    jobReference: { jobId: 'harness-ai-job' },
    schema: {
      fields: [
        { name: 'result', type: 'STRING' },
        { name: 'status', type: 'STRING' }
      ]
    },
    rows: [{
      f: [
        { v: text == null ? null : String(text) },
        { v: status == null || status === '' ? null : String(status) }
      ]
    }],
    totalBytesProcessed: '0',
    cacheHit: false,
    _labelsCheck: labelsCheck || null
  };
}

global.HtmlService = {
  createTemplateFromFile: function () { throw new Error('HtmlService is not exercised by the harness'); },
  createHtmlOutputFromFile: function () { throw new Error('HtmlService is not exercised by the harness'); },
  // Unlike the two above, this one is a real path worth testing: it is what
  // the unauthorized page is built from, not a template requiring the files
  // the harness has no filesystem view of.
  createHtmlOutput: function (html) {
    var content = html;
    var title = '';
    var frameMode = null;
    var output = {
      getContent: function () { return content; },
      setTitle: function (value) { title = value; return output; },
      getTitle: function () { return title; },
      setXFrameOptionsMode: function (mode) { frameMode = mode; return output; },
      getXFrameOptionsMode: function () { return frameMode; }
    };
    return output;
  },
  XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' }
};

global.ScriptApp = {
  getOAuthToken: function () { return 'harness-token'; }
};

/*
 * The active user, and the one Google Group this dashboard checks membership
 * against. Both configurable per test rather than hardcoded, so a test can put
 * the harness in each of the states doGet() has to handle: a member, a
 * non-member, no identifiable user, an unconfigured group, and the group
 * lookup itself throwing.
 */
let activeUserEmail = 'reviewer@elastic.co';
let groupMembers = {};
let groupLookupError = null;
/** Optional per-group errors; checked before the global groupLookupError. */
let groupLookupErrors = {};

global.Session = Object.assign({}, global.Session, {
  getActiveUser: function () {
    return { getEmail: function () { return activeUserEmail; } };
  }
});

global.GroupsApp = {
  getGroupByEmail: function (email) {
    if (groupLookupErrors[email]) throw groupLookupErrors[email];
    if (groupLookupError) throw groupLookupError;
    const members = groupMembers[email] || [];
    return { hasUser: function (candidate) { return members.indexOf(candidate) !== -1; } };
  }
};

function setActiveUser(email) { activeUserEmail = email; }
function setGroupMembers(groupEmail, members) { groupMembers[groupEmail] = members; }
/**
 * @param {Error|null} error Global lookup error when groupEmail omitted; clear with null.
 * @param {string=} groupEmail When set, scopes the error to that group only.
 */
function setGroupLookupError(error, groupEmail) {
  if (groupEmail) {
    if (error) groupLookupErrors[groupEmail] = error;
    else delete groupLookupErrors[groupEmail];
    return;
  }
  groupLookupError = error;
  if (!error) groupLookupErrors = {};
}

/*
 * Vertex AI, off by default. A test that wants a generation installs a
 * responder; everything else exercises the fallback, which is the path a
 * deployment without VERTEX_PROJECT actually takes.
 */
let fetchResponder = null;
global.UrlFetchApp = {
  fetch: function (url, options) {
    if (!fetchResponder) throw new Error('UrlFetchApp was called with no responder installed');
    return fetchResponder(url, options);
  }
};

/** Installs a responder, or clears it when passed nothing. */
function onFetch(responder) { fetchResponder = responder || null; }

/** A generateContent response in the shape Vertex AI/AI Studio returns. */
function vertexResponse(text, code) {
  const body = JSON.stringify({
    candidates: [{ content: { parts: [{ text: text }] }, finishReason: 'STOP' }],
    usageMetadata: { totalTokenCount: 1234 }
  });
  return {
    getResponseCode: function () { return code || 200; },
    getContentText: function () { return body; }
  };
}

/** A Messages API response in the shape Anthropic returns. */
function anthropicResponse(text, code) {
  const body = JSON.stringify({
    content: [{ type: 'text', text: text }],
    stop_reason: 'end_turn',
    usage: { input_tokens: 600, output_tokens: 200 }
  });
  return {
    getResponseCode: function () { return code || 200; },
    getContentText: function () { return body; }
  };
}

/** Loads backend files into this shared global scope, in dependency order. */
function loadBackend(files) {
  const root = path.join(__dirname, '..', 'shared');
  files.forEach(function (file) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInThisContext(source, { filename: file });
  });
}

/**
 * Loads shared/ScopeEngine.html's generated <script> content into a fresh,
 * isolated sandbox (not the shared global scope `loadBackend` uses), so its
 * `buildScope_` is a genuinely separate copy from the server's. That is the
 * whole point of loading it here: a test can call both and diff the result,
 * which is what proves the generated client file actually matches the server
 * function it was lifted from, rather than merely having the same source text.
 *
 * @return {{build: function(!Object, !Object, !Object): !Object}} ScopeEngine
 */
function loadScopeEngine() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'shared', 'ScopeEngine.html'), 'utf8');
  const start = html.indexOf('<script>');
  const end = html.lastIndexOf('</script>');
  if (start === -1 || end === -1) {
    throw new Error('loadScopeEngine: no <script> block found; run tools/gen_scope_engine.js first');
  }
  const script = html.slice(start + '<script>'.length, end);
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox, { filename: 'ScopeEngine.html' });
  if (!sandbox.ScopeEngine) throw new Error('loadScopeEngine: generated script did not define ScopeEngine');
  return sandbox.ScopeEngine;
}

module.exports = {
  loadBackend: loadBackend,
  loadScopeEngine: loadScopeEngine,
  properties: PROPERTIES,
  onFetch: onFetch,
  onBigQuery: onBigQuery,
  bigQueryAiResponse: bigQueryAiResponse,
  vertexResponse: vertexResponse,
  anthropicResponse: anthropicResponse,
  setActiveUser: setActiveUser,
  setGroupMembers: setGroupMembers,
  setGroupLookupError: setGroupLookupError
};
