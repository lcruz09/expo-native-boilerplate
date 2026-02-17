#!/usr/bin/env node

/**
 * Interactive script to run the Expo app with various options
 */

const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper to execute commands
const exec = (command, options = {}) => {
  console.log(`\n📦 Running: ${command}\n`);
  try {
    execSync(command, { stdio: "inherit", ...options });
    return true;
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}\n`);
    return false;
  }
};

// Helper to ask questions
const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

// Main script
(async () => {
  console.log("\n🚀 Wattr App Runner\n");

  // 1. Platform selection
  console.log("📱 Select platform:");
  console.log("  1) iOS");
  console.log("  2) Android");
  const platformChoice = await ask("\nEnter choice (1 or 2): ");
  const platform = platformChoice.trim() === "1" ? "ios" : "android";

  // 2. Prebuild option
  console.log("\n🔧 Prebuild options:");
  console.log("  1) Skip prebuild (faster, use existing native code)");
  console.log("  2) Run prebuild (update native dependencies)");
  console.log("  3) Clean prebuild (remove and regenerate native code)");
  const prebuildChoice = await ask("\nEnter choice (1, 2, or 3): ");

  let shouldPrebuild = false;
  let shouldClean = false;

  if (prebuildChoice.trim() === "2") {
    shouldPrebuild = true;
  } else if (prebuildChoice.trim() === "3") {
    shouldPrebuild = true;
    shouldClean = true;
  }

  // 3. Device selection
  console.log("\n📱 Device options:");
  console.log("  1) Let Expo choose device");
  console.log("  2) Select specific device");
  const deviceChoice = await ask("\nEnter choice (1 or 2): ");

  let deviceFlag = "";
  if (deviceChoice.trim() === "2") {
    deviceFlag = "--device";
  }

  rl.close();

  console.log("\n" + "=".repeat(60));
  console.log("📋 Configuration Summary:");
  console.log("=".repeat(60));
  console.log(`Platform: ${platform.toUpperCase()}`);
  console.log(
    `Prebuild: ${shouldClean ? "Clean & Rebuild" : shouldPrebuild ? "Yes" : "Skip"}`,
  );
  console.log(`Device Selection: ${deviceFlag ? "Manual" : "Automatic"}`);
  console.log("=".repeat(60) + "\n");

  // Execute commands
  try {
    // Run prebuild if needed
    if (shouldPrebuild) {
      console.log(
        shouldClean
          ? "🧹 Running clean prebuild...\n"
          : "🔧 Running prebuild...\n",
      );
      const cleanFlag = shouldClean ? " --clean" : "";
      const prebuildCmd = `npx expo prebuild --platform ${platform}${cleanFlag}`;
      if (!exec(prebuildCmd)) {
        process.exit(1);
      }
    }

    // Build and run
    console.log("🚀 Starting development build...\n");
    const runCmd = `npx expo run:${platform}${deviceFlag ? " " + deviceFlag : ""}`;
    exec(runCmd);

    console.log("\n✅ Done!\n");
  } catch (error) {
    console.error("\n❌ An error occurred:", error.message, "\n");
    process.exit(1);
  }
})();
