import apiClient, { StandardApiResponse } from "@/src/api/client";
import { handleApiError, parseApiResponse } from "@/src/utils/apiHelpers";
import {
  getDemoLibraryBooks,
  getDemoLibrarySearchResults,
} from "@/src/utils/demoData";
import * as SecureStore from "@/src/utils/secureStore";

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

export interface LibrarySearchResult {
  sl_no: number;
  acc_title: string;
  acc_edition: string;
  acc_author: string;
  acc_subject: string;
  tot_copy: number;
  tot_shelf: number;
  tot_issued: number;
  tot_ref_book: number;
  m_sel: string;
  m_book: string;
}

export type LibrarySearchField =
  | "acc_title"
  | "acc_author_name"
  | "acc_call"
  | "acc_isbn";

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

    return parseApiResponse<LibraryBook[]>(dataString, []);
  } catch (error) {
    handleApiError(error, "Fetch library books");
  }
};

/**
 * Search library books.
 * @param {string} readerCode - Student/reader code.
 * @param {LibrarySearchField} field - Field to search by.
 * @param {string} query - Search query.
 * @returns {Promise<LibrarySearchResult[]>} List of search results.
 */
export const searchLibraryBooks = async (
  readerCode: string,
  field: LibrarySearchField,
  query: string
): Promise<LibrarySearchResult[]> => {
  try {
    const isDemoFlag = await SecureStore.getItemAsync("is_demo_account");
    if (isDemoFlag === "true") {
      return getDemoLibrarySearchResults();
    }

    const response = await apiClient.post<StandardApiResponse>("", {
      parameters: ["@p_reader_code", "@p_rptfldname", "@p_name"],
      values: [readerCode, field, `%${query}%`],
      function: "PROC_APP_GET_OPAC_SEARCH",
      branch_id: "998",
    });

    if (response.data.errorCode !== 0) {
      throw new Error(
        response.data.message || "Failed to search library books"
      );
    }

    const dataString = response.data.data.data;
    if (dataString === "") {
      return [];
    }

    return parseApiResponse<LibrarySearchResult[]>(dataString, []);
  } catch (error) {
    handleApiError(error, "Search library books");
  }
};

/**
 * Reserve a library book.
 * @param {string} readerCode - Student/reader code.
 * @param {string} title - Book title.
 * @param {string} author - Book author.
 * @returns {Promise<{ message: string; error: number }>} Result of the reservation request.
 */
export const reserveLibraryBook = async (
  readerCode: string,
  title: string,
  author: string
): Promise<{ message: string; error: number }> => {
  try {
    const response = await apiClient.post<StandardApiResponse>("", {
      parameters: ["@p_reader_code", "@p_title", "@p_author"],
      values: [readerCode, title, author],
      function: "Proc_App_Save_Booking_Req",
      branch_id: "998",
    });

    if (response.data.errorCode !== 0) {
      throw new Error(response.data.message || "Failed to reserve book");
    }

    const dataString = response.data.data.data;
    if (dataString === "") {
      throw new Error("Empty response from server");
    }

    const parsed = parseApiResponse<any[]>(dataString, []);
    const result = parsed[0];
    return { message: result.err_mesg, error: result.err_no };
  } catch (error) {
    handleApiError(error, "Reserve library book");
  }
};
