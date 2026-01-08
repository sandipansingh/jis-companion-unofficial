import { create } from "zustand";
import {
  LibraryBook,
  LibraryFilterType,
  LibrarySearchField,
  LibrarySearchResult,
  reserveLibraryBook,
  searchLibraryBooks,
} from "../api/library";
import { syncLibraryBooks } from "../services/sync";
import { useAuthStore } from "./authStore";

interface LibraryState {
  books: LibraryBook[];
  filterType: LibraryFilterType;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  fromCache: boolean;
  searchResults: LibrarySearchResult[];
  searchLoading: boolean;
  searchError: string | null;
  searchQuery: string;

  fetchBooks: (readerCode: string, type: LibraryFilterType) => Promise<void>;
  setFilterType: (type: LibraryFilterType) => void;
  clearError: () => void;
  clearBooks: () => void;
  searchBooks: (field: LibrarySearchField, query: string) => Promise<void>;
  reserveBook: (book: LibrarySearchResult) => Promise<string>;
  clearSearchResults: () => void;
  clearSearchError: () => void;
  setSearchQuery: (query: string) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  books: [],
  filterType: "1",
  loading: false,
  error: null,
  isOnline: true,
  fromCache: false,
  searchResults: [],
  searchLoading: false,
  searchError: null,
  searchQuery: "",

  fetchBooks: async (readerCode: string, type: LibraryFilterType) => {
    set({ loading: true, error: null });
    try {
      const result = await syncLibraryBooks(readerCode, type);

      console.log(
        `Fetched ${result.books.length} library books (fromCache: ${result.fromCache})`
      );

      set({
        books: result.books,
        filterType: type,
        loading: false,
        isOnline: result.isOnline,
        fromCache: result.fromCache,
        error: null,
      });
    } catch (error: any) {
      console.error("Failed to fetch library books:", error);
      set({
        error: error.message || "Failed to fetch library books",
        loading: false,
      });
    }
  },

  setFilterType: (type: LibraryFilterType) => {
    set({ filterType: type });
  },

  clearError: () => {
    set({ error: null });
  },

  clearBooks: async () => {
    try {
      const { studentId } = useAuthStore.getState();
      if (studentId) {
        const { deleteLibraryBooks } = await import("../services/database");
        await deleteLibraryBooks(studentId);
      }
      set({
        books: [],
        error: null,
        loading: false,
        fromCache: false,
      });
    } catch (error) {
      console.error("Error clearing library books:", error);
      set({
        books: [],
        error: null,
        loading: false,
        fromCache: false,
      });
    }
  },

  searchBooks: async (field: LibrarySearchField, query: string) => {
    const { studentId } = useAuthStore.getState();
    if (!studentId) {
      set({ searchError: "Student ID not found" });
      return;
    }

    set({ searchLoading: true, searchError: null });

    try {
      const results = await searchLibraryBooks(studentId, field, query);
      set({ searchResults: results, searchLoading: false });
    } catch (error: any) {
      set({ searchError: error.message, searchLoading: false });
    }
  },

  reserveBook: async (book: LibrarySearchResult) => {
    const { studentId } = useAuthStore.getState();
    if (!studentId) {
      throw new Error("Student ID not found");
    }

    const result = await reserveLibraryBook(
      studentId,
      book.acc_title,
      book.acc_author
    );

    if (result.error !== 0) {
      throw new Error(result.message);
    }
    return result.message;
  },

  clearSearchResults: () => {
    set({ searchResults: [], searchLoading: false, searchError: null });
  },

  clearSearchError: () => {
    set({ searchError: null });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
}));
