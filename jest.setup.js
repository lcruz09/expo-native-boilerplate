/**
 * Jest setup file to configure global test environment.
 * Automatically loaded after the test framework is set up.
 * For module mocks, see jest.mocks.js which loads earlier.
 */

// Suppress Node.js deprecation warnings (like punycode)
process.removeAllListeners("warning");
process.on("warning", (warning) => {
  // Suppress punycode deprecation warnings from dependencies
  if (
    warning.name === "DeprecationWarning" &&
    warning.message.includes("punycode")
  ) {
    return;
  }
  // Show other warnings
  console.warn(warning);
});

// Provide FormData for environments where it's missing (Node tests)
if (typeof global.FormData === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  global.FormData = require("form-data");
}

// Set global test timeout to prevent hanging tests
jest.setTimeout(10000);
