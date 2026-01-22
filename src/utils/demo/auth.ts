import { LoginResponse, UserProfileData } from "@/src/features/auth/api/auth";
import { DEMO_COLLEGE, DEMO_COURSE, DEMO_STUDENT } from "./constants";

/**
 * Compute the date range and metadata for the current semester.
 * 
 * - Odd semester: July to December
 * - Even semester: January to June
 */
function getCurrentSemesterDates() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

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
 * Create a mock login response for demo mode.
 */
export function getDemoLoginData(): LoginResponse {
  const semesterDates = getCurrentSemesterDates();

  return {
    is_valid: 1,
    VesionNo: "1.0.0",
    IosVesionNo: "1.0.0",
    std_id: DEMO_STUDENT.id,
    batch_id: DEMO_COURSE.batchId,
    student_name: DEMO_STUDENT.name,
    batch_name: DEMO_STUDENT.batch,
    sem_id: DEMO_COURSE.semId,
    sem_no: DEMO_COURSE.semNo,
    fin_year_id: DEMO_COURSE.finYearId,
    from_date: semesterDates.from_date,
    to_date: semesterDates.to_date,
    academic_year: semesterDates.academic_year,
    sem_type: semesterDates.sem_type,
    course_code: DEMO_COURSE.code,
    stream_code: DEMO_COURSE.streamCode,
    college_id: DEMO_COLLEGE.id,
    college_name: DEMO_COLLEGE.name,
    college_sht_name: DEMO_COLLEGE.shortName,
    branch_id: DEMO_COLLEGE.branchId,
    closing: 0,
    profile_pict: "",
    start_sem_no: DEMO_COURSE.startSemNo,
    end_sem_no: DEMO_COURSE.endSemNo,
  };
}

/**
 * Mock user profile returned in demo mode.
 */
export const DEMO_USER_PROFILE: UserProfileData = {
  STUDENT_REGISTRATION_DETAIL_nSemId: 1,
  STUDENT_REGISTRATION_DETAIL_nSemNo: 1,
  STUDENT_REGISTRATION_DETAIL_sRoll: DEMO_STUDENT.roll,
  STUDENT_REGISTRATION_DETAIL_sReg: DEMO_STUDENT.reg,
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
