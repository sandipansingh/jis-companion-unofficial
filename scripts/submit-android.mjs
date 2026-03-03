import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildsDir = path.join(rootDir, 'builds');

const isTruthy = (value) => {
  if (value == null) return false;
  const normalized = String(value).trim().toLowerCase();
  return !['', '0', 'false', 'no', 'off'].includes(normalized);
};

const skipBuild =
  process.argv.includes('--skip-build') ||
  isTruthy(process.env.npm_config_skip_build) ||
  isTruthy(process.env.SKIP_BUILD);

const run = (cmd, opts = {}) => {
  console.log(`→ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: rootDir, ...opts });
};

try {
  if (skipBuild) {
    console.log('Skipping Android build (--skip-build passed).\n');
  } else {
    console.log('Building Android AAB locally...\n');
    run('npm run build:android:prod:local');
  }

  console.log('\nFinding AAB file...');
  const files = fs
    .readdirSync(buildsDir)
    .filter((f) => f.endsWith('.aab'))
    .map((f) => ({
      name: f,
      path: path.join(buildsDir, f),
      time: fs.statSync(path.join(buildsDir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    console.error('❌ No .aab files found in builds/ directory');
    process.exit(1);
  }

  const aabFile = files[0];
  console.log(`Found: ${aabFile.name}`);
  console.log(`Path: ${aabFile.path}\n`);

  console.log('Submitting to Google Play...\n');
  run(
    `eas submit -p android --profile production --path "${aabFile.path}" --non-interactive`,
  );

  console.log('\nAndroid build submitted successfully!');
} catch (err) {
  console.error('\n❌ Submit failed:', err.message || err);
  process.exit(1);
}
