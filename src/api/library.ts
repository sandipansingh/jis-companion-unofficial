import { getDemoLibraryBooks } from "../utils/demoData";
import * as SecureStore from "../utils/secureStore";
import apiClient, { StandardApiResponse } from "./client";

export interface LibraryBook {
  acc_type_id: number;
  acc_type: string;
  reader_id: number;
  reader_code: string;
  reader_name: string;
  reader_dept: string;
  reader_acc_id: number;
  reader_acc_no: string;
  reader_acc_name: string;
  issue_date: string;
  return_date: string;
  return_id: number;
  act_return_date?: string;
}

export type LibraryFilterType = "1" | "2"; // 1 = all, 2 = pending

/**
 * Fetch library books issued to a reader.
 * @param {string} readerCode - Student/reader code.
 * @param {LibraryFilterType} type - Filter type: "1" for all books, "2" for pending returns.
 * @returns {Promise<LibraryBook[]>} List of library books.
 * @throws {Error} When the API returns a non-zero error code or the request fails.
 */
export const fetchLibraryBooks = async (
  readerCode: string,
  type: LibraryFilterType
): Promise<LibraryBook[]> => {
  try {
    const isDemoFlag = await SecureStore.getItemAsync("is_demo_account");
    if (isDemoFlag === "true") {
      const allBooks = getDemoLibraryBooks();

      // Filter based on type: "1" for all books, "2" for pending only
      if (type === "2") {
        return allBooks.filter((book) => book.return_id === 0);
      }
      return allBooks;
    }

    const response = await apiClient.post<StandardApiResponse>("", {
      parameters: ["@p_reader_code", "@p_type"],
      values: [readerCode, type],
      function: "PROC_APP_GET_READER_WISE_ACC_ISSUE",
      branch_id: "998",
    });

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to fetch library books");
    }

    const dataString = response.data.data.data;
    if (dataString === "") {
      return [];
    }

    const books = JSON.parse(dataString) as LibraryBook[];
    return books;
  } catch (error: any) {
    console.error("Error fetching library books:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch library books"
    );
  }
};
