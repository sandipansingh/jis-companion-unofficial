/**
 * Creates a URL-safe composite identifier for a class.
 * Format: date-empCode-periodName
 * Forward slashes in empCode are converted to underscores for URL safety.
 *
 * Example: "2026-01-14-NIT_0112-6"
 */
export function createClassId(date: string, empCode: string, periodName: string): string {
  // Extract date (YYYY-MM-DD) from ISO string
  const dateOnly = date.split('T')[0];

  // Extract period number from format "6 (12.20-13.00)"
  const periodNumber = periodName?.split(' ')[0] || '1';

  if (!empCode) {
    console.warn('createClassId: empCode is undefined or null');
    return `${dateOnly}-unknown-${periodNumber}`;
  }

  // Replace / with _ for URL safety
  const safeEmpCode = empCode.replace(/\//g, '_');

  return `${dateOnly}-${safeEmpCode}-${periodNumber}`;
}

/**
 * Parses a class identifier back into its components.
 *
 * @returns Parsed components or null if the ID format is invalid
 */
export function parseClassId(classId: string): {
  date: string;
  empCode: string;
  periodName: string;
} | null {
  // Split by hyphen, but need to handle the date portion which has hyphens
  const parts = classId.split('-');

  if (parts.length < 5) {
    return null;
  }

  // Date is first 3 parts (YYYY-MM-DD)
  const date = `${parts[0]}-${parts[1]}-${parts[2]}`;

  // Emp code is next 2 parts (NIT_0112)
  const empCode = `${parts[3]}/${parts[4]}`;

  // Period is the last part
  const periodName = parts[5] || parts[parts.length - 1];

  return {
    date,
    empCode,
    periodName,
  };
}
