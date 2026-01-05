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
  fullName: string
): { code: string; name: string } => {
  if (!fullName) return { code: "", name: "" };
  const parts = fullName.split(" - ");
  return {
    code: parts[0]?.trim() || "",
    name: parts[1]?.trim() || fullName,
  };
};
