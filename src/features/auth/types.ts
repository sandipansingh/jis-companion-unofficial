export interface LoginResponse {
  is_valid: number;
  VesionNo: string;
  IosVesionNo: string;
  std_id: number;
  batch_id: number;
  student_name: string;
  batch_name: string;
  sem_id: number;
  sem_no: number;
  fin_year_id: number;
  from_date: string;
  to_date: string;
  academic_year: number;
  sem_type: string;
  course_code: string;
  stream_code: string;
  college_id: number;
  college_name: string;
  college_sht_name: string;
  branch_id: number;
  closing: number;
  profile_pict: string;
  start_sem_no: number;
  end_sem_no: number;
}

export interface LoginParams {
  studentId: string;
  password: string;
}

export interface UserProfileData {
  STUDENT_REGISTRATION_DETAIL_nSemId?: number;
  STUDENT_REGISTRATION_DETAIL_nSemNo?: number;
  STUDENT_REGISTRATION_DETAIL_sRoll?: string;
  STUDENT_REGISTRATION_DETAIL_sReg?: string;
  STUDENT_REGISTRATION_DETAIL_sStdMobile?: string;
  STUDENT_REGISTRATION_DETAIL_sStdEmail?: string;
  STUDENT_REGISTRATION_DETAIL_sGurName?: string;
  STUDENT_REGISTRATION_DETAIL_sGurMobile?: string;
  STUDENT_REGISTRATION_DETAIL_sGurEmail?: string;
  STUDENT_REGISTRATION_DETAIL_sAdd?: string;
  STUDENT_REGISTRATION_DETAIL_sBankAccNo?: string;
  STUDENT_REGISTRATION_DETAIL_sBankName?: string;
  STUDENT_REGISTRATION_DETAIL_sBankBranch?: string;
  STUDENT_REGISTRATION_DETAIL_sBankIfsc?: string;
  STUDENT_REGISTRATION_DETAIL_sSgpa1?: number;
  STUDENT_REGISTRATION_DETAIL_sSgpa2?: number;
  STUDENT_REGISTRATION_DETAIL_sSgpa3?: number;
  STUDENT_REGISTRATION_DETAIL_sSgpa4?: number;
  STUDENT_REGISTRATION_DETAIL_sSgpa5?: number;
  STUDENT_REGISTRATION_DETAIL_sSgpa6?: number;
  STUDENT_REGISTRATION_DETAIL_sSgpa7?: number;
  STUDENT_REGISTRATION_DETAIL_sSgpa8?: number;
  STUDENT_REGISTRATION_DETAIL_sSgpa9?: number;
  STUDENT_REGISTRATION_DETAIL_sSgpa10?: number;
  present_address?: string;
  present_city?: string;
  present_pin?: string;
  permanemt_address?: string;
  permanemt_city?: string;
  permanemt_pin?: string;
  std_adm_mobile?: string;
  std_adm_email?: string;
  std_dob?: string;
  std_blood_group?: string;
  marks_x?: string;
  marks_xii?: string;
  marks_dip?: string;
  marks_graduate?: string;
  marks_pg?: string;
  gurdian_adm_mobile?: string;
  gurdian_adm_email?: string;
  profile_pict_adm?: string;
  profile_pict_cur?: string;
  profile_pict_adm_url?: string;
  profile_pict_cur_url?: string;
  gurdian_cur_add?: string;
  std_student_master_english_full_marks?: number;
  std_student_master_english_obt_marks?: number;
  std_student_master_physics_full_marks?: number;
  std_student_master_physics_obt_marks?: number;
  std_student_master_chemistry_full_marks?: number;
  std_student_master_chemistry_obt_marks?: number;
  std_student_master_math_full_marks?: number;
  std_student_master_math_obt_marks?: number;
}
