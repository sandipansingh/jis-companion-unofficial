/**
 * Creates a composite faculty identifier for routing.
 * Format: URL-safe encoded string combining facCode, subCode, and secId.
 * The facCode is encoded with encodeURIComponent so slashes become %2F
 * and existing underscores are preserved intact.
 * Example: NIT/0123-R25_M101-1 becomes NIT%2F0123-R25_M101-1
 *          DEMO_F001-R25_M101-1 stays DEMO_F001-R25_M101-1
 */
export function createFacultyId(facCode: string, subCode: string, secId: number): string {
  const safeFacCode = encodeURIComponent(facCode);
  return `${safeFacCode}-${subCode}-${secId}`;
}

/**
 * Parses a composite faculty identifier into its components.
 * @param id - The composite ID (e.g., "NIT%2F0123-R25_M101-1" or "DEMO_F001-R25_M101-1")
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

  // Everything before subCode is facCode (decoded from encodeURIComponent)
  const encodedFacCode = parts.slice(0, -2).join('-');
  if (!encodedFacCode) {
    return null;
  }

  let facCode: string;
  try {
    facCode = decodeURIComponent(encodedFacCode);
  } catch {
    return null;
  }

  return { facCode, subCode, secId };
}
