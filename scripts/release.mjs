import { execSync } from 'child_process';
import fs from 'fs';

const type = process.argv[2] || 'patch';

const run = (cmd, opts = {}) => {
  console.log(`→ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
};

const execOut = (cmd) => {
  try {
    return execSync(cmd, { encoding: 'utf8' }).toString().trim();
  } catch {
    return '';
  }
};

function getDirtyFiles() {
  const modified = execOut('git diff --name-only');
  const untracked = execOut('git ls-files --others --exclude-standard');
  const files = [...modified.split('\n'), ...untracked.split('\n')]
    .map((f) => f.trim())
    .filter(Boolean);
  return [...new Set(files)];
}

function tagExists(tag) {
  try {
    execSync(`git rev-parse --verify refs/tags/${tag}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

try {
  const dirtyFiles = getDirtyFiles();
  const allowed = new Set(['package.json', 'app.json']);

  if (dirtyFiles.length > 0) {
    const onlyAllowed = dirtyFiles.every((f) => allowed.has(f));
    if (onlyAllowed) {
      console.log('Working tree has only version files changed — staging them.');
      run('git add package.json app.json');
    } else {
      console.error(
        '❌ Working tree not clean. Commit or stash your changes first.\nFiles:',
        dirtyFiles.join(', '),
      );
      process.exit(1);
    }
  }

  run(`node scripts/bump-version.mjs ${type}`);

  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const version = pkg.version;
  const tag = `v${version}`;

  run('git add package.json app.json');
  const diff = execOut('git diff --cached --name-only');
  if (diff) {
    run(`git commit -m "chore(release): v${version}"`);
  } else {
    console.log('ℹ No staged changes to commit.');
  }

  run('git push origin HEAD');
  console.log(`Pushed commit for v${version}`);

  if (!tagExists(tag)) {
    run(`git tag ${tag}`);
    run(`git push origin ${tag}`);
    console.log(`Created and pushed tag ${tag}`);
  } else {
    console.log(`Tag ${tag} already exists — skipping tag creation.`);
  }

  console.log(`\nReleased v${version} successfully`);
} catch (err) {
  console.error('\n❌ Release failed:', err.message || err);
  process.exit(1);
}
