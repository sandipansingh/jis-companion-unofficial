import { useEffect, useRef } from 'react';

import { PyqFilterParams, usePyqStore } from '../store/pyqStore';
import { PyqSearchFilter } from '../types';
import { useDebouncedSearch } from './useDebouncedSearch';

function buildFilterParams(query: string, filter: PyqSearchFilter): PyqFilterParams {
  const trimmed = query.trim();
  if (!trimmed) return {};

  switch (filter) {
    case 'subjectName':
      return trimmed.length >= 2 ? { subjectName: trimmed } : {};
    case 'subjectCode':
      return trimmed.length >= 1 ? { subjectCode: trimmed } : {};
    case 'year': {
      const year = parseInt(trimmed, 10);
      return !isNaN(year) ? { year } : {};
    }
    case 'semester': {
      const sem = parseInt(trimmed, 10);
      return !isNaN(sem) && sem >= 1 && sem <= 8 ? { semester: sem } : {};
    }
    case 'stream':
      return trimmed.length >= 1 ? { stream: trimmed } : {};
    default:
      return {};
  }
}

export function usePyqData(collegeCode: string) {
  const fetchInitial = usePyqStore((state) => state.fetchInitial);
  const fetchMore = usePyqStore((state) => state.fetchMore);
  const setSearchQuery = usePyqStore((state) => state.setSearchQuery);
  const setSelectedPyq = usePyqStore((state) => state.setSelectedPyq);
  const searchQuery = usePyqStore((state) => state.searchQuery);
  const searchFilter = usePyqStore((state) => state.searchFilter);
  const pyqs = usePyqStore((state) => state.pyqs);
  const initialLoading = usePyqStore((state) => state.initialLoading);
  const loadingMore = usePyqStore((state) => state.loadingMore);
  const isFetching = usePyqStore((state) => state.isFetching);
  const page = usePyqStore((state) => state.page);
  const totalPages = usePyqStore((state) => state.totalPages);
  const error = usePyqStore((state) => state.error);
  const storeCollegeCode = usePyqStore((state) => state.collegeCode);

  const debouncedSearch = useDebouncedSearch(searchQuery, 400);

  const isResuming = storeCollegeCode === collegeCode;
  const prevCollegeRef = useRef<string>(isResuming ? collegeCode : '');
  const prevSearchRef = useRef<string>(isResuming ? searchQuery : '');
  const initializedRef = useRef(isResuming);

  useEffect(() => {
    if (!collegeCode) return;

    const isNewCollege = prevCollegeRef.current !== collegeCode;

    if (isNewCollege || !initializedRef.current) {
      prevCollegeRef.current = collegeCode;
      prevSearchRef.current = '';
      initializedRef.current = true;

      if (isNewCollege) {
        setSearchQuery('');
      }

      fetchInitial(collegeCode, undefined);
    }
  }, [collegeCode, fetchInitial, setSearchQuery]);

  useEffect(() => {
    if (!collegeCode || !initializedRef.current) return;
    if (prevCollegeRef.current !== collegeCode) return;

    const hasChanged = prevSearchRef.current !== debouncedSearch;
    if (!hasChanged) return;

    prevSearchRef.current = debouncedSearch;

    const trimmed = debouncedSearch.trim();
    const minLen = searchFilter === 'subjectName' ? 2 : 1;

    if (trimmed.length === 0 || trimmed.length >= minLen) {
      fetchInitial(
        collegeCode,
        trimmed ? buildFilterParams(debouncedSearch, searchFilter) : undefined,
      );
    }
  }, [debouncedSearch, collegeCode, fetchInitial, searchFilter]);

  const handleEndReached = () => {
    if (loadingMore || isFetching || page >= totalPages) return;

    const trimmed = searchQuery.trim();
    fetchMore(trimmed ? buildFilterParams(searchQuery, searchFilter) : undefined);
  };

  const showLoadMore = !initialLoading && page < totalPages;

  return {
    pyqs,
    initialLoading,
    loadingMore,
    error,
    searchQuery,
    searchFilter,
    page,
    totalPages,
    setSearchQuery,
    setSelectedPyq,
    handleEndReached,
    showLoadMore,
    retry: () => {
      const trimmed = searchQuery.trim();
      fetchInitial(
        collegeCode,
        trimmed ? buildFilterParams(searchQuery, searchFilter) : undefined,
      );
    },
  };
}
