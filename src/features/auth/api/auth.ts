import apiClient, {
  StandardApiResponse,
  unofficialApiClient,
} from "@/src/api/client";
import {
  DEMO_USER_PROFILE,
  getDemoLoginData,
  isDemoAccount,
} from "@/src/utils/demoData";
import * as SecureStore from "@/src/utils/secureStore";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import { ulid } from "ulid";

// ulid on Android workaround
if (typeof global.crypto !== "object") {
  global.crypto = {} as any;
}
if (typeof global.crypto.getRandomValues !== "function") {
  global.crypto.getRandomValues = ((array: any) => {
    const randomBytes = Crypto.getRandomBytes(array.length);
    array.set(randomBytes);
    return array;
  }) as any;
}

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

/**
 * Authenticate a student against the official API.
 *
 * Side effects:
 * - Stores `student_id` and `student_password` in `expo-secure-store` on success.
 * - Sets/clears `is_demo_account` depending on whether demo credentials were used.
 *
 * @param {LoginParams} params
 * @returns {Promise<LoginResponse>} Parsed login response.
 * @throws {Error} When credentials are invalid or the request fails.
 */
export async function login({
  studentId,
  password,
}: LoginParams): Promise<LoginResponse> {
  try {
    if (isDemoAccount(studentId, password)) {
      await SecureStore.setItemAsync("student_id", studentId);
      await SecureStore.setItemAsync("student_password", password);
      await SecureStore.setItemAsync("is_demo_account", "true");

      return getDemoLoginData();
    }

    await SecureStore.deleteItemAsync("is_demo_account");

    const brandName = Device.brand || "unknown";
    const deviceId = Device.modelId || "unknown";

    let uniqueId = await SecureStore.getItemAsync("device_unique_id");
    if (!uniqueId) {
      uniqueId = ulid();
      await SecureStore.setItemAsync("device_unique_id", uniqueId);
    }

    const body = {
      parameters: [
        "@p_user_id",
        "@p_pass_word",
        "@p_brand_name",
        "@p_token",
        "@p_deviceId",
        "@p_uniqueId",
      ],
      values: [studentId, password, brandName, "", deviceId, uniqueId],
      function: "Proc_App_Student_Login_Academic",
      branch_id: "0",
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Login failed");
    }

    const dataString = response.data.data.data;
    const parsedData = JSON.parse(dataString) as LoginResponse;

    if (parsedData.is_valid !== 1) {
      throw new Error("Invalid credentials");
    }

    await SecureStore.setItemAsync("student_id", studentId);
    await SecureStore.setItemAsync("student_password", password);

    return parsedData;
  } catch (error: any) {
    console.error("Login error:", error);

    if (error.response) {
      throw new Error(error.response.data?.message || "Server error occurred");
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "Login failed");
    }
  }
}

/**
 * Get stored credentials (if present) from secure storage.
 * @returns {Promise<{ studentId: string; password: string; isDemoAccount?: boolean } | null>}
 * Credential object or null when not available.
 */
export async function getStoredCredentials(): Promise<{
  studentId: string;
  password: string;
  isDemoAccount?: boolean;
} | null> {
  try {
    const [studentId, password, isDemoFlag] = await Promise.all([
      SecureStore.getItemAsync("student_id"),
      SecureStore.getItemAsync("student_password"),
      SecureStore.getItemAsync("is_demo_account"),
    ]);

    if (studentId && password) {
      return {
        studentId,
        password,
        isDemoAccount: isDemoFlag === "true",
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting stored credentials:", error);
    return null;
  }
}

/**
 * Fetch the student's profile data.
 *
 * @param {string} branchId - Branch id as string.
 * @param {string} stdId - Student id.
 * @returns {Promise<UserProfileData>} Profile data.
 * @throws {Error} When the API request fails.
 */
export async function fetchUserProfile(
  branchId: string,
  stdId: string
): Promise<UserProfileData> {
  try {
    const isDemoFlag = await SecureStore.getItemAsync("is_demo_account");
    if (isDemoFlag === "true") {
      return DEMO_USER_PROFILE;
    }

    const body = {
      parameters: ["@p_branch_id", "@p_StudentId", "@p_is_jeson"],
      values: [branchId, stdId, "1"],
      function: "Proc_Get_Student_Registration_Data",
      branch_id: branchId,
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to fetch user profile");
    }

    const dataString = response.data.data.data;
    const parsedData = JSON.parse(dataString) as UserProfileData;
    return parsedData;
  } catch (error: any) {
    console.error("Fetch user profile error:", error);

    if (error.response) {
      throw new Error(error.response.data?.message || "Server error occurred");
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "Failed to fetch user profile");
    }
  }
}

/**
 * Change a student's password via the unofficial API.
 *
 * Side effects:
 * - Updates `student_password` in secure storage on success.
 *
 * @param {string} studentId
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {Promise<{ success: boolean; message: string }>} Result payload.
 * @throws {Error} When the request fails or the server rejects the change.
 */
export async function changePassword(
  studentId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    const body = {
      studentId,
      oldPassword,
      newPassword,
    };

    const response = await unofficialApiClient.post(
      "/auth/change-password",
      body
    );

    if (response.data?.success) {
      await SecureStore.setItemAsync("student_password", newPassword);
      return response.data;
    } else {
      throw new Error(response.data?.message || "Failed to change password");
    }
  } catch (error: any) {
    console.error("Change password error:", error);

    if (error.response) {
      throw new Error(error.response.data?.message || "Server error occurred");
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "Failed to change password");
    }
  }
}

/**
 * Clear stored user credentials and demo flag.
 * @returns {Promise<void>}
 */
export async function clearUserData(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync("student_id"),
      SecureStore.deleteItemAsync("student_password"),
      SecureStore.deleteItemAsync("is_demo_account"),
    ]);
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
}
