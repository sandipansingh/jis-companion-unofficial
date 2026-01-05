import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const type = process.argv[2] || "patch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgPath = path.resolve(__dirname, "../package.json");
const appPath = path.resolve(__dirname, "../app.json");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const app = JSON.parse(fs.readFileSync(appPath, "utf8"));

function bump(version, type) {
  let [major, minor, patch] = version.split(".").map(Number);

  if (type === "major") {
    major++;
    minor = 0;
    patch = 0;
  } else if (type === "minor") {
    minor++;
    patch = 0;
  } else {
    patch++;
  }

  return `${major}.${minor}.${patch}`;
}

const newVersion = bump(pkg.version, type);
const [major, minor, patch] = newVersion.split(".").map(Number);
const buildNumber = major * 1_000_000 + minor * 1_000 + patch;

// package.json
pkg.version = newVersion;

// app.json
app.expo.version = newVersion;

// Android
app.expo.android ??= {};
app.expo.android.versionCode = buildNumber;

// iOS
app.expo.ios ??= {};
app.expo.ios.buildNumber = String(buildNumber);

// write files
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
fs.writeFileSync(appPath, JSON.stringify(app, null, 2) + "\n");

console.log(`✅ Version: ${newVersion}`);
console.log(`Android versionCode: ${buildNumber}`);
console.log(`iOS buildNumber: ${buildNumber}`);
