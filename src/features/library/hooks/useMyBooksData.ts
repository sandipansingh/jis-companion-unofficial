import { useAuthStore } from "@/src/features/auth/store/authStore";
import { useAlertStore } from "@/src/store/alertStore";
import { useEffect } from "react";
import { LibraryFilterType } from "../api";
import { useLibraryStore } from "../store";

export function useMyBooksData() {
  const { showAlert } = useAlertStore();
  const { studentId } = useAuthStore();
  const {
    books,
    loading,
    error,
    filterType,
    fetchBooks,
    setFilterType,
    clearError,
  } = useLibraryStore();

  useEffect(() => {
    if (studentId) {
      loadBooks();
    }
  }, []);

  useEffect(() => {
    if (error) {
      showAlert({
        title: "Error",
        message: error,
        onConfirm: clearError,
      });
    }
  }, [error]);

  const loadBooks = async () => {
    if (studentId) {
      await fetchBooks(studentId, filterType);
    }
  };

  const handleFilterChange = (type: LibraryFilterType) => {
    if (type === filterType) return;
    setFilterType(type);
    if (studentId) {
      fetchBooks(studentId, type);
    }
  };

  return {
    books,
    loading,
    error,
    filterType,
    studentId,
    loadBooks,
    handleFilterChange,
  };
}
