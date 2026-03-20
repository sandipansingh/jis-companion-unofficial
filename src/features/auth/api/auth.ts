import apiClient, { StandardApiResponse, unofficialApiClient } from '@/src/api/client';
import { handleApiError, parseApiResponse } from '@/src/utils/apiHelpers';
import { getVersionId } from '@/src/utils/appInfo';
import {
  DEMO_CREDENTIALS,
  DEMO_USER_PROFILE,
  getDemoLoginData,
  isDemoAccount,
} from '@/src/utils/demo';
import { getOrCreateInstallId } from '@/src/utils/installId';
import * as SecureStore from '@/src/utils/secureStore';

import { isValidLogin, LoginParams, LoginResponse, UserProfileData } from '../types';

/**
 * Authenticate a student against the official API.
 *
 * Side effects:
 * - Stores `student_id` and `student_password` in `expo-secure-store` on success.
 * - Sets/clears `is_demo_account` depending on whether demo credentials were used.
 *
 * @param {LoginParams} params
 * @returns {Promise<LoginResponse>} Parsed login response.
 * @throws {Error} When the request fails.
 */
export async function login({
  studentId,
  password,
}: LoginParams): Promise<LoginResponse> {
  try {
    if (isDemoAccount(studentId, password)) {
      await SecureStore.setItemAsync('student_id', studentId);
      await SecureStore.setItemAsync('student_password', password);
      await SecureStore.setItemAsync('is_demo_account', 'true');

      return getDemoLoginData();
    }

    await SecureStore.deleteItemAsync('is_demo_account');

    const [installId, versionId] = await Promise.all([
      getOrCreateInstallId(),
      Promise.resolve(getVersionId()),
    ]);

    const body = {
      parameters: ['@p_user_id', '@p_pass_word', '@p_vId', '@p_iId'],
      values: [studentId, password, versionId, installId],
      function: 'Proc_Student_Login_Academic_App_New',
      branch_id: '0',
    };

    const response = await apiClient.post<StandardApiResponse>('', body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || 'Login failed');
    }

    const parsedData = parseApiResponse<LoginResponse>(
      response.data.data.data,
      {} as LoginResponse,
    );

    if (isValidLogin(parsedData.is_valid)) {
      await SecureStore.setItemAsync('student_id', studentId);
      await SecureStore.setItemAsync('student_password', password);
    }

    return parsedData;
  } catch (error) {
    handleApiError(error, 'Login');
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
      SecureStore.getItemAsync('student_id'),
      SecureStore.getItemAsync('student_password'),
      SecureStore.getItemAsync('is_demo_account'),
    ]);

    if (studentId && password) {
      return {
        studentId,
        password,
        isDemoAccount: isDemoFlag === 'true',
      };
    }

    if (studentId && isDemoFlag === 'true') {
      return {
        studentId,
        password: DEMO_CREDENTIALS.password,
        isDemoAccount: true,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting stored credentials:', error);
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
  stdId: string,
): Promise<UserProfileData> {
  try {
    const isDemoFlag = await SecureStore.getItemAsync('is_demo_account');
    if (isDemoFlag === 'true') {
      return DEMO_USER_PROFILE;
    }

    const [installId, versionId] = await Promise.all([
      getOrCreateInstallId(),
      Promise.resolve(getVersionId()),
    ]);

    const body = {
      parameters: ['@p_branch_id', '@p_StudentId', '@p_vId', '@p_iId', '@p_is_jeson'],
      values: [branchId, stdId, versionId, installId, '1'],
      function: 'Proc_Get_Student_Registration_Data_New',
      branch_id: branchId,
    };

    const response = await apiClient.post<StandardApiResponse>('', body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || 'Failed to fetch user profile');
    }

    return parseApiResponse<UserProfileData>(
      response.data.data.data,
      {} as UserProfileData,
    );
  } catch (error) {
    handleApiError(error, 'Fetch user profile');
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
  newPassword: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const body = {
      studentId,
      oldPassword,
      newPassword,
    };

    const response = await unofficialApiClient.post('/auth/change-password', body);

    if (response.data?.success) {
      await SecureStore.setItemAsync('student_password', newPassword);
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Failed to change password');
    }
  } catch (error) {
    handleApiError(error, 'Change password');
  }
}

/**
 * Clear stored user credentials and demo flag.
 * @returns {Promise<void>}
 */
export async function clearUserData(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync('student_id'),
      SecureStore.deleteItemAsync('student_password'),
      SecureStore.deleteItemAsync('is_demo_account'),
      SecureStore.deleteItemAsync('install_id'),
    ]);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}
