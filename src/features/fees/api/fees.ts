import apiClient, { StandardApiResponse } from '@/src/api/client';
import { handleApiError, parseApiResponse } from '@/src/utils/apiHelpers';
import { getVersionId } from '@/src/utils/appInfo';
import { getDemoFeeData } from '@/src/utils/demo';
import { getOrCreateInstallId } from '@/src/utils/installId';

import { FeeLedgerEntry } from '../types';

/**
 * Fetch the student's fee ledger summary.
 *
 * @param {string} studentId - Student code.
 * @param {number} branchId - Branch id used by the backend.
 * @returns {Promise<FeeLedgerEntry[]>} Ledger entries; empty when demo mode is enabled or no data exists.
 * @throws {Error} When the API returns a non-zero error code or a request fails.
 */
export async function fetchStudentFeeLedger(
  studentId: string,
  branchId: number,
): Promise<FeeLedgerEntry[]> {
  try {
    const { useAuthStore } = await import('@/src/features/auth/store/authStore');
    if (useAuthStore.getState().isDemoAccount) {
      return getDemoFeeData();
    }

    if (!studentId || studentId.trim() === '' || !branchId) {
      return [];
    }

    const [installId, versionId] = await Promise.all([
      getOrCreateInstallId(),
      Promise.resolve(getVersionId()),
    ]);

    const branchIdStr = branchId?.toString();

    const body = {
      parameters: ['@p_branch_id', '@p_student_code', '@p_vId', '@p_iId'],
      values: [branchIdStr, studentId, versionId, installId],
      function: 'Proc_App_Disp_Student_Ledger_Summ_New',
      branch_id: branchIdStr,
    };

    const response = await apiClient.post<StandardApiResponse>('', body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || 'Failed to load fee ledger');
    }

    const dataString = response.data.data.data;
    if (dataString === '') {
      return [];
    }

    return parseApiResponse<FeeLedgerEntry[]>(dataString, []);
  } catch (error) {
    handleApiError(error, 'Fetch fee ledger');
  }
}
