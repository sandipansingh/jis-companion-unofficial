import { useCallback, useEffect } from 'react';

import { useFeesStore } from '../store';

export function useFeesData() {
  const { feeData, loading, error, fetchFeeData, fromCache, isOnline } = useFeesStore();

  const loadFeeData = useCallback(async () => {
    await fetchFeeData();
  }, [fetchFeeData]);

  useEffect(() => {
    loadFeeData();
  }, [loadFeeData]);

  const refreshFeeData = async () => {
    await fetchFeeData();
  };

  return {
    feeData,
    loading,
    error,
    fromCache,
    isOnline,
    loadFeeData,
    refreshFeeData,
  };
}
