import apiClient, { StandardApiResponse } from "@/src/api/client";
import { handleApiError, parseApiResponse } from "@/src/utils/apiHelpers";
import { getDemoFeeData } from "@/src/utils/demo";

export interface FeeLedgerEntry {
  vou_date: string;
  mr_no: string;
  chq_no: string;
  act_amt: number;
  bill_amt: number;
  recd_amt: number;
  bill_type_name: string;
  sem_name: string;
  bal_amt: number;
}

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
    const { useAuthStore } =
      await import("@/src/features/auth/store/authStore");
    if (useAuthStore.getState().isDemoAccount) {
      return getDemoFeeData();
    }

    if (!studentId || studentId.trim() === "" || !branchId) {
      return [];
    }

    const branchIdStr = branchId?.toString();

    const body = {
      parameters: ["@p_branch_id", "@p_student_code"],
      values: [branchIdStr, studentId],
      function: "Proc_App_Disp_Student_Ledger_Summ",
      branch_id: branchIdStr,
    };

    const response = await apiClient.post<StandardApiResponse>("", body);

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to load fee ledger");
    }

    const dataString = response.data.data.data;
    if (dataString === "") {
      return [];
    }

    return parseApiResponse<FeeLedgerEntry[]>(dataString, []);
  } catch (error) {
    handleApiError(error, "Fetch fee ledger");
  }
}
