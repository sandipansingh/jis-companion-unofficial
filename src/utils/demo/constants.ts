/**
 * Demo account constants
 * Shared configuration for demo mode
 */

export const DEMO_CREDENTIALS = {
  username: "NIT/0000/0000",
  password: "SandipanSingh_Dev_2025",
};

export const DEMO_STUDENT = {
  id: 999999,
  code: "NIT/0000/0000",
  name: "Demo Student",
  batch: "CSE AI & ML [2025-2029]",
  sem: 1,
  roll: "2511999999",
  reg: "211999999999",
};

export const DEMO_COLLEGE = {
  id: 2,
  name: "Narula Institute of Technology",
  shortName: "NIT",
  branchId: 3,
};

export const DEMO_COURSE = {
  code: "C001",
  streamCode: "C009",
  batchId: 1,
  semId: 1,
  semNo: 1,
  finYearId: 1,
  startSemNo: 1,
  endSemNo: 8,
};

/**
 * Check whether the given credentials match the demo account.
 */
export function isDemoAccount(studentId: string, password: string): boolean {
  return (
    studentId.toLowerCase() === DEMO_CREDENTIALS.username.toLowerCase() &&
    password === DEMO_CREDENTIALS.password
  );
}
