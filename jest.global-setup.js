/**
 * Jest global setup
 *
 * Runs before any Jest setup files or presets to inject globals required by dependencies.
 */

module.exports = async () => {
  // Ensure FormData exists before expo/jest-expo setup runs
  if (typeof global.FormData === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const FormData = require("form-data");
    global.FormData = FormData;
    globalThis.FormData = FormData;
  }
};
