import {
  LibrarySearchField,
  LibrarySearchResult,
} from "@/src/features/library/api/library";
import { useAlertStore } from "@/src/store/alertStore";
import { useEffect, useState } from "react";
import { useLibraryStore } from "../store";

export function useSearchReserveData() {
  const { showAlert } = useAlertStore();
  const {
    searchResults,
    searchLoading,
    searchError,
    clearSearchResults,
    searchBooks,
    reserveBook,
    clearSearchError,
    searchQuery,
    setSearchQuery,
  } = useLibraryStore();

  const [searchField, setSearchField] =
    useState<LibrarySearchField>("acc_title");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchError) {
      showAlert({
        title: "Search Error",
        message: searchError,
        onConfirm: clearSearchError,
      });
    }
  }, [searchError]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      clearSearchResults();
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    searchBooks(searchField, searchQuery);
  };

  const handleReserve = async (book: LibrarySearchResult) => {
    showAlert({
      title: "Confirm Reservation",
      message: `Do you want to reserve "${book.acc_title}"?`,
      showCancel: true,
      onConfirm: async () => {
        try {
          const message = await reserveBook(book);
          showAlert({
            title: "Success",
            message: message || "Reservation request sent successfully",
          });
        } catch (e: any) {
          showAlert({ title: "Reservation Failed", message: e.message });
        }
      },
    });
  };

  const getSearchFieldLabel = (field: LibrarySearchField) => {
    const labels: Record<LibrarySearchField, string> = {
      acc_title: "Title",
      acc_author_name: "Author",
      acc_call: "Call No",
      acc_isbn: "ISBN",
    };
    return labels[field] || "Title";
  };

  return {
    searchResults,
    searchLoading,
    searchError,
    searchQuery,
    searchField,
    showFilterDropdown,
    hasSearched,
    setSearchQuery,
    setSearchField,
    setShowFilterDropdown,
    handleSearch,
    handleReserve,
    getSearchFieldLabel,
  };
}
