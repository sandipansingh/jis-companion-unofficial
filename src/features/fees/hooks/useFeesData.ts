import { useEffect } from "react";
import { useFeesStore } from "../store";

export function useFeesData() {
  const { feeData, loading, error, fetchFeeData, fromCache, isOnline } =
    useFeesStore();

  useEffect(() => {
    loadFeeData();
  }, []);

  const loadFeeData = async () => {
    await fetchFeeData();
  };

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
