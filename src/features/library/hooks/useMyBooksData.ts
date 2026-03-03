import { useCallback, useEffect } from 'react';

import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useAlertStore } from '@/src/store/alertStore';

import { useLibraryStore } from '../store';
import { LibraryFilterType } from '../types';

export function useMyBooksData() {
  const { showAlert } = useAlertStore();
  const { studentId } = useAuthStore();
  const { books, loading, error, filterType, fetchBooks, setFilterType, clearError } =
    useLibraryStore();

  const loadBooks = useCallback(async () => {
    if (studentId) {
      await fetchBooks(studentId, filterType);
    }
  }, [studentId, fetchBooks, filterType]);

  useEffect(() => {
    if (studentId) {
      loadBooks();
    }
  }, [studentId, loadBooks]);

  useEffect(() => {
    if (error) {
      showAlert({
        title: 'Error',
        message: error,
        onConfirm: clearError,
      });
    }
  }, [error, clearError, showAlert]);

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
