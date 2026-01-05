import { create } from "zustand";
import { LibraryBook, LibraryFilterType } from "../api/library";
import { syncLibraryBooks } from "../services/sync";
import { useAuthStore } from "./authStore";

interface LibraryState {
  books: LibraryBook[];
  filterType: LibraryFilterType;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  fromCache: boolean;

  fetchBooks: (readerCode: string, type: LibraryFilterType) => Promise<void>;
  setFilterType: (type: LibraryFilterType) => void;
  clearError: () => void;
  clearBooks: () => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  books: [],
  filterType: "1",
  loading: false,
  error: null,
  isOnline: true,
  fromCache: false,

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
}));
