/**
 * Extracts the file name from a URL or path string.
 * @param {string} url - Full URL or file path.
 * @returns {string} File name portion of the URL (empty string if input is falsy).
 * @example
 * getFileName("https://example.com/files/report.pdf") // "report.pdf"
 */
export const getFileName = (url: string): string => {
  if (!url) return "";
  const parts = url.split("/");
  return parts[parts.length - 1];
};

/**
 * Parses a subject string into subject code and subject name.
 * Expected format: "CODE - Subject Name".
 * @param {string} fullName - Full subject string.
 * @returns {{ code: string; name: string }} Parsed subject code and name.
 * @example
 * parseSubjectName("CS101 - Data Structures")
 * // { code: "CS101", name: "Data Structures" }
 *
 * @example
 * parseSubjectName("Data Structures")
 * // { code: "Data Structures", name: "Data Structures" }
 */
export const parseSubjectName = (
  fullName: string,
): { code: string; name: string } => {
  if (!fullName) return { code: "", name: "" };
  const parts = fullName.split(" - ");
  return {
    code: parts[0]?.trim() || "",
    name: parts[1]?.trim() || fullName,
  };
};

/**
 * Normalizes student ID to the standard format (PREFIX/YYYY/NNNN).
 * Accepts both formats: "NIT/2025/0000" or "nit20250000"
 * @param {string} studentId - Student ID in any format
 * @returns {string} Normalized student ID in PREFIX/YYYY/NNNN format
 * @example
 * normalizeStudentId("nit20250000") // "NIT/2025/0000"
 * normalizeStudentId("NIT/2025/0000") // "NIT/2025/0000"
 */
export const normalizeStudentId = (studentId: string): string => {
  if (!studentId) return "";

  const trimmed = studentId.trim();

  // If already in correct format (contains slashes), return as-is with uppercase prefix
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/");
    if (parts.length === 3) {
      return `${parts[0].toUpperCase()}/${parts[1]}/${parts[2]}`;
    }
    return trimmed;
  }

  // Handle compact format like "nit20250000"
  // Pattern: PREFIX (letters) + YEAR (4 digits) + NUMBER (remaining digits)
  const match = trimmed.match(/^([a-zA-Z]+)(\d{4})(\d+)$/);

  if (match) {
    const [, prefix, year, number] = match;
    return `${prefix.toUpperCase()}/${year}/${number.padStart(4, "0")}`;
  }

  // If format doesn't match, return as-is
  return trimmed;
};
