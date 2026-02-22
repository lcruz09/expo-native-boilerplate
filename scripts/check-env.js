#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 *
 * This script helps diagnose issues with .env file loading.
 * Run with: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Environment Variables Diagnostic Tool\n');

// Check for .env files
const envFiles = ['.env', '.env.local'];
const projectRoot = path.join(__dirname, '..');

console.log('📁 Checking for .env files:');
envFiles.forEach((file) => {
  const filePath = path.join(projectRoot, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}: ${exists ? 'Found' : 'Not found'}`);

  if (exists) {
    const stats = fs.statSync(filePath);
    console.log(`     Size: ${stats.size} bytes`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter((line) => line.trim() && !line.startsWith('#'));

      console.log(`     Lines: ${lines.length} non-empty lines`);

      // Check for EXPO_PUBLIC_ variables
      const expoPublicVars = lines.filter((line) => line.includes('EXPO_PUBLIC_'));
      console.log(`     EXPO_PUBLIC_ vars: ${expoPublicVars.length}`);

      // Validate format
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        if (!line.includes('=')) {
          console.log(`     ⚠️  Line ${lineNum}: Missing '=' sign`);
        } else if (line.match(/\s*=\s*/)) {
          const parts = line.split('=');
          const key = parts[0].trim();
          const hasSpaces = parts[0] !== key || (parts[1] && parts[1] !== parts[1].trim());

          if (hasSpaces) {
            console.log(`     ⚠️  Line ${lineNum}: Has spaces around '=' (should be KEY=value)`);
          }

          if (!key.startsWith('EXPO_PUBLIC_')) {
            console.log(`     ⚠️  Line ${lineNum}: "${key}" doesn't start with EXPO_PUBLIC_`);
          }

          // Check if value is quoted
          const value = parts.slice(1).join('=');
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            console.log(`     ℹ️  Line ${lineNum}: Value is quoted (usually not needed)`);
          }
        }
      });

      // Show what variables would be loaded
      console.log('\n     📋 Variables that should be loaded:');
      expoPublicVars.forEach((line) => {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        const displayValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
        console.log(`        ${key.trim()} = ${displayValue}`);
      });
    } catch (error) {
      console.log(`     ❌ Error reading file: ${error.message}`);
    }
  }
});

// Check what process.env has
console.log('\n🔧 Current process.env EXPO_PUBLIC_ variables:');
const envVars = Object.keys(process.env).filter((key) => key.startsWith('EXPO_PUBLIC_'));
if (envVars.length === 0) {
  console.log('  ❌ No EXPO_PUBLIC_ variables found in process.env');
  console.log('  ℹ️  This is expected - Expo loads them at runtime, not in Node.js scripts');
} else {
  envVars.forEach((key) => {
    const value = process.env[key];
    const displayValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
    console.log(`  ${key} = ${displayValue}`);
  });
}

// Provide recommendations
console.log('\n💡 Recommendations:');
console.log('  1. Ensure your .env file is in the project root (same level as package.json)');
console.log('  2. Use format: EXPO_PUBLIC_KEY=value (no spaces around =)');
console.log("  3. Don't use quotes unless value contains spaces");
console.log('  4. All variables must start with EXPO_PUBLIC_');
console.log('  5. After fixing, run: npx expo start --clear');

console.log('\n✨ Example .env file:');
console.log('  EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
console.log('  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here');
