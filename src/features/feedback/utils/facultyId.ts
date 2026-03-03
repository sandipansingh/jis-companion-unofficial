/**
 * Creates a composite faculty identifier for routing
 * Format: URL-safe encoded string combining facCode, subCode, and secId
 * Example: NIT/0123-R25_M101-1 becomes NIT_0123-R25_M101-1
 */
export function createFacultyId(facCode: string, subCode: string, secId: number): string {
  const safeFacCode = facCode.replace(/\//g, '_');
  return `${safeFacCode}-${subCode}-${secId}`;
}

/**
 * Parses a composite faculty identifier into its components
 * @param id - The composite ID (e.g., "NIT_0123-R25_M101-1")
 * @returns Object with facCode, subCode, secId, or null if invalid
 */
export function parseFacultyId(id: string): {
  facCode: string;
  subCode: string;
  secId: number;
} | null {
  const parts = id.split('-');

  if (parts.length < 3) {
    return null;
  }

  // Last part is always secId (numeric)
  const secId = parseInt(parts[parts.length - 1], 10);
  if (isNaN(secId)) {
    return null;
  }

  // Second to last is subCode (can contain underscores like R25_M101)
  const subCode = parts[parts.length - 2];
  if (!subCode) {
    return null;
  }

  // Everything before subCode is facCode (may contain hyphens)
  const encodedFacCode = parts.slice(0, -2).join('-');
  if (!encodedFacCode) {
    return null;
  }

  const facCode = encodedFacCode.replace(/_/g, '/');

  return { facCode, subCode, secId };
}
