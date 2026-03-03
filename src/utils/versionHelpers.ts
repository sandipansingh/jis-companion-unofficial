/**
 * Represents the type of version update
 */
export type UpdateType = 'major' | 'minor' | 'patch' | 'none';

/**
 * Parses a semantic version string into major, minor, and patch numbers
 * @param version - Version string in format "x.y.z"
 * @returns Object with major, minor, and patch numbers
 */
const parseVersion = (
  version: string,
): { major: number; minor: number; patch: number } => {
  const parts = version.split('.').map((part) => parseInt(part, 10));
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
  };
};

/**
 * Compares two semantic version strings and determines the update type
 * @param currentVersion - Current app version (e.g., "1.0.4")
 * @param latestVersion - Latest available version (e.g., "1.0.5")
 * @returns The type of update: "major", "minor", "patch", or "none"
 */
export const getUpdateType = (
  currentVersion: string,
  latestVersion: string,
): UpdateType => {
  const current = parseVersion(currentVersion);
  const latest = parseVersion(latestVersion);

  // No update needed
  if (
    current.major === latest.major &&
    current.minor === latest.minor &&
    current.patch === latest.patch
  ) {
    return 'none';
  }

  // Check if current version is ahead (shouldn't happen in production)
  if (current.major > latest.major) return 'none';
  if (current.major === latest.major && current.minor > latest.minor) return 'none';
  if (
    current.major === latest.major &&
    current.minor === latest.minor &&
    current.patch > latest.patch
  )
    return 'none';

  // Major update
  if (latest.major > current.major) {
    return 'major';
  }

  // Minor update
  if (latest.minor > current.minor) {
    return 'minor';
  }

  // Patch update
  if (latest.patch > current.patch) {
    return 'patch';
  }

  return 'none';
};
