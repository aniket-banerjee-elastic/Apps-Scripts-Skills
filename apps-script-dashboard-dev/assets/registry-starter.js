/**
 * Minimal mode-registry shape for Apps Script dashboards.
 * Copy into shared Config / registry module; expand per product.
 *
 * Each mode: id, title, population, shareKind, panels, queries,
 * moneyFields, bands, toggles, copySlots, schemaRev, enabledByDefault.
 */

var DASH_MODES = {
  // example: "metrics": { id: "metrics", title: "…", enabledByDefault: true, schemaRev: 1, … }
};

/** Enabled ids: script property / allow-list overlay on defaults. */
function getEnabledDashboards() {
  // Read ENABLED_DASHBOARDS (or equivalent) and intersect with DASH_MODES.
  return Object.keys(DASH_MODES).filter(function (id) {
    var m = DASH_MODES[id];
    return m && m.enabledByDefault !== false;
  });
}

/** Landing / FAQ copy must call this — never hard-code view titles in HTML. */
function getLandingCopyFromRegistry_() {
  return getEnabledDashboards().map(function (id) {
    var m = DASH_MODES[id];
    return { id: id, title: m.title, population: m.population || "" };
  });
}
