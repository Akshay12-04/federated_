/** @type {Promise<object> | null} */
let manifestPromise = null;

/**
 * @returns {Promise<object>}
 */
export function loadEncodingManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch("data/encoding-manifest.json")
      .then((r) => {
        if (!r.ok) throw new Error("encoding manifest missing");
        return r.json();
      })
      .catch(() => ({
        feature_order: [],
        categories: {},
        wizard_defaults: {},
      }));
  }
  return manifestPromise;
}
