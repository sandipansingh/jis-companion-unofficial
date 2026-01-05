import {
  AttendanceData,
  DateWiseAttendance,
  SubjectWiseAttendance,
} from "@/src/api/academics";
import { LoginResponse, UserProfileData } from "@/src/api/auth";

/**
 * Demo data helpers used when the app is running in "demo account" mode.
 *
 * Notes:
 * - Demo values are intentionally static and predictable.
 * - Date-driven demo functions generate recent dates in local timezone.
 */

/**
 * Compute the date range and metadata for the current semester.
 *
 * Rules:
 * - Odd semester: July to December
 * - Even semester: January to June
 *
 * @returns {{ from_date: string; to_date: string; academic_year: number; sem_type: "ODD" | "EVEN" }}
 * Date range and semester type.
 */
function getCurrentSemesterDates() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Odd semester: July to December
  // Even semester: January to June
  if (month >= 7) {
    return {
      from_date: `${year}-07-01`,
      to_date: `${year}-12-31`,
      academic_year: year,
      sem_type: "ODD" as const,
    };
  } else {
    return {
      from_date: `${year}-01-01`,
      to_date: `${year}-06-30`,
      academic_year: year,
      sem_type: "EVEN" as const,
    };
  }
}

/**
 * Generate a list of recent ISO dates (YYYY-MM-DD), skipping Sundays.
 *
 * @param {number} [count=8] - Maximum number of dates to return.
 * @returns {string[]} Recent date strings in descending order (today backwards).
 */
function getRecentDates(count: number = 8): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Skip Sundays
    if (date.getDay() !== 0) {
      dates.push(date.toISOString().split("T")[0]);
    }
  }

  return dates.slice(0, count);
}

/**
 * Demo account credentials.
 *
 * @notes
 * - Used only for local demo mode; not intended for real accounts.
 */
export const DEMO_CREDENTIALS = {
  username: "google_tester",
  password: "google@nit127",
};

/**
 * Check whether the given credentials match the demo account.
 * @param {string} studentId
 * @param {string} password
 * @returns {boolean} True when the credentials match the demo account.
 */
export function isDemoAccount(studentId: string, password: string): boolean {
  return (
    studentId.toLowerCase() === DEMO_CREDENTIALS.username.toLowerCase() &&
    password === DEMO_CREDENTIALS.password
  );
}

/**
 * Create a mock login response for demo mode.
 *
 * @returns {LoginResponse} Login-like payload matching the official API contract.
 */
export function getDemoLoginData(): LoginResponse {
  const semesterDates = getCurrentSemesterDates();

  return {
    is_valid: 1,
    VesionNo: "1.0.0",
    IosVesionNo: "1.0.0",
    std_id: 999999,
    batch_id: 1,
    student_name: "Demo Student",
    batch_name: "CSE AI & ML [2025-2029]",
    sem_id: 1,
    sem_no: 1,
    fin_year_id: 1,
    from_date: semesterDates.from_date,
    to_date: semesterDates.to_date,
    academic_year: semesterDates.academic_year,
    sem_type: semesterDates.sem_type,
    course_code: "BTECH",
    stream_code: "CSE",
    college_id: 2,
    college_name: "Narula Institute of Technology",
    college_sht_name: "NIT",
    branch_id: 3,
    closing: 0,
    profile_pict: "",
    start_sem_no: 1,
    end_sem_no: 8,
  };
}

/**
 * Mock user profile returned in demo mode.
 */
export const DEMO_USER_PROFILE: UserProfileData = {
  STUDENT_REGISTRATION_DETAIL_nSemId: 1,
  STUDENT_REGISTRATION_DETAIL_nSemNo: 1,
  STUDENT_REGISTRATION_DETAIL_sRoll: "2511999999",
  STUDENT_REGISTRATION_DETAIL_sReg: "211999999999",
  STUDENT_REGISTRATION_DETAIL_sStdMobile: "+91 9876543210",
  STUDENT_REGISTRATION_DETAIL_sStdEmail: "demo.student@nit.ac.in",
  STUDENT_REGISTRATION_DETAIL_sGurName: "Demo Guardian",
  STUDENT_REGISTRATION_DETAIL_sGurMobile: "+91 9876543211",
  STUDENT_REGISTRATION_DETAIL_sGurEmail: "demo.guardian@email.com",
  STUDENT_REGISTRATION_DETAIL_sAdd: "123 Demo Street, Kalyani, Nadia",
  STUDENT_REGISTRATION_DETAIL_sBankAccNo: "1234567890",
  STUDENT_REGISTRATION_DETAIL_sBankName: "Demo Bank",
  STUDENT_REGISTRATION_DETAIL_sBankBranch: "Kalyani Branch",
  STUDENT_REGISTRATION_DETAIL_sBankIfsc: "DEMO0001234",
  STUDENT_REGISTRATION_DETAIL_sSgpa1: 0,
  STUDENT_REGISTRATION_DETAIL_sSgpa2: 0,
  STUDENT_REGISTRATION_DETAIL_sSgpa3: 0,
  STUDENT_REGISTRATION_DETAIL_sSgpa4: 0,
  STUDENT_REGISTRATION_DETAIL_sSgpa5: 0,
  STUDENT_REGISTRATION_DETAIL_sSgpa6: 0,
  STUDENT_REGISTRATION_DETAIL_sSgpa7: 0,
  present_address: "123 Demo Street, Kalyani",
  present_city: "Kalyani",
  present_pin: "741235",
  permanemt_address: "123 Demo Street, Kalyani",
  permanemt_city: "Kalyani",
  permanemt_pin: "741235",
  std_adm_mobile: "+91 9876543210",
  std_adm_email: "demo.student@nit.ac.in",
  std_dob: "2007-05-15",
  std_blood_group: "O+",
  marks_x: "92.5",
  marks_xii: "89.8",
  marks_dip: "",
  marks_graduate: "",
  marks_pg: "",
  gurdian_adm_mobile: "+91 9876543211",
  gurdian_adm_email: "demo.guardian@email.com",
  profile_pict_adm: "",
  profile_pict_cur: "",
  profile_pict_adm_url: "",
  profile_pict_cur_url: "",
  gurdian_cur_add: "123 Demo Street, Kalyani, Nadia",
  std_student_master_english_full_marks: 100,
  std_student_master_english_obt_marks: 85,
  std_student_master_physics_full_marks: 100,
  std_student_master_physics_obt_marks: 90,
  std_student_master_chemistry_full_marks: 100,
  std_student_master_chemistry_obt_marks: 88,
  std_student_master_math_full_marks: 100,
  std_student_master_math_obt_marks: 92,
};

/**
 * Mock overall attendance summary returned in demo mode.
 */
export const DEMO_ATTENDANCE_DATA: AttendanceData = {
  total_class: 320,
  attd: 288,
  pcent: 90.0,
};

/**
 * Create mock subject-wise attendance entries for demo mode.
 *
 * @returns {SubjectWiseAttendance[]} Subject-wise attendance records.
 */
export function getDemoSubjectAttendance(): SubjectWiseAttendance[] {
  const dates = getRecentDates(4);
  const subjects = [
    {
      id: 101,
      name: "Engineering Mathematics I",
      faculty: "Dr. A. Kumar",
      period: "09:00 AM - 10:00 AM",
    },
    {
      id: 102,
      name: "Engineering Physics",
      faculty: "Prof. B. Sharma",
      period: "10:00 AM - 11:00 AM",
    },
    {
      id: 103,
      name: "Programming for Problem Solving",
      faculty: "Dr. C. Patel",
      period: "11:30 AM - 12:30 PM",
    },
    {
      id: 104,
      name: "Basic Electrical Engineering",
      faculty: "Prof. D. Singh",
      period: "01:30 PM - 02:30 PM",
    },
  ];

  const attendance: SubjectWiseAttendance[] = [];

  dates.forEach((date, dateIdx) => {
    subjects.slice(0, dateIdx < 2 ? 2 : 2).forEach((subject, subIdx) => {
      attendance.push({
        date1: date,
        batch1: 1,
        CourseId1: 1,
        StreamId1: 1,
        SectionId1: 1,
        SemesterId1: 1,
        SubjectId1: subject.id,
        subject_name: subject.name,
        emp_code: `EMP00${subIdx + 1}`,
        faculty: subject.faculty,
        GroupId1: 1,
        Period1: subIdx + 1,
        Period_name: subject.period,
        ctr1: 45,
        is_app: 1,
        present1: 42 + subIdx,
        absent1: 3 - subIdx,
        concat_data: "",
        stat: 42 + subIdx >= 0 ? "Present" : "Absent",
        upload1: "",
        upload2: "",
        upload3: "",
        upload4: "",
        upload5: "",
        assignment_id: 0,
        assignment_status: 0,
        assignment_marks: 0,
        feedback: 0,
      });
    });
  });

  return attendance;
}

/**
 * Create mock date-wise attendance summary entries for demo mode.
 *
 * @returns {DateWiseAttendance[]} Date-wise attendance records.
 */
export function getDemoDateAttendance(): DateWiseAttendance[] {
  const dates = getRecentDates(8);

  return dates.map((date, idx) => ({
    rtDate: date,
    rtCount: 3 + (idx % 3),
    rtPresent: 3 + (idx % 3) - (idx % 2),
  }));
}
