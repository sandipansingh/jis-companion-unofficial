import {
  LibraryFilterType,
  LibrarySearchField,
  LibrarySearchResult,
} from "@/src/api/library";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { useAuthStore } from "@/src/store/authStore";
import { useLibraryStore } from "@/src/store/libraryStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { useRouter } from "expo-router";
import {
  Book,
  BookmarkPlus,
  BookOpen,
  Check,
  ChevronLeft,
  Clock,
  Filter,
  Search,
  Sparkles,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ViewMode = "my-books" | "search";

export default function LibraryScreen() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const router = useRouter();
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

  const [viewMode, setViewMode] = useState<ViewMode>("my-books");
  const [searchField, setSearchField] =
    useState<LibrarySearchField>("acc_title");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterClickRef = useRef(false);

  useEffect(() => {
    if (studentId && viewMode === "my-books") {
      fetchBooks(studentId, filterType);
    }
  }, [viewMode]);

  useEffect(() => {
    if (error) {
      showAlert({
        title: "Error",
        message: error,
        onConfirm: clearError,
      });
    }
  }, [error]);

  useEffect(() => {
    if (searchError) {
      showAlert({
        title: "Search Error",
        message: searchError,
        onConfirm: clearSearchError,
      });
    }
  }, [searchError]);

  const handleFilterChange = (type: LibraryFilterType) => {
    if (type === filterType) return;
    setFilterType(type);
    if (studentId) {
      fetchBooks(studentId, type);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      clearSearchResults();
      return;
    }
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

  const handleBack = () => {
    router.back();
  };

  const renderBookItem = ({ item }: { item: any }) => (
    <View style={[styles.bookCard, { backgroundColor: colors.surface }]}>
      <View
        style={[
          styles.bookCover,
          {
            backgroundColor: colors.primary + "15",
            borderColor: colors.primary + "30",
          },
        ]}
      >
        <Book size={36} color={colors.primary} />
      </View>

      <View style={styles.bookDetails}>
        <View style={styles.bookHeader}>
          <View
            style={[
              styles.bookTypeBadge,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Text
              style={[styles.bookTypeText, { color: colors.primary }]}
              numberOfLines={1}
            >
              {item.acc_type}
            </Text>
          </View>
          {item.return_id === 0 && (
            <View style={[styles.dueIndicator, { backgroundColor: "#FEF3C7" }]}>
              <Clock size={12} color="#F59E0B" />
              <Text style={styles.dueText}>Due</Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.bookTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.reader_acc_name}
        </Text>
        <Text style={[styles.accNumber, { color: colors.textMuted }]}>
          Acc: {item.reader_acc_no}
        </Text>

        <View style={[styles.dateSection, { borderTopColor: colors.border }]}>
          <View style={styles.dateColumn}>
            <Text style={[styles.dateLabel, { color: colors.textMuted }]}>
              Issued
            </Text>
            <Text style={[styles.dateValue, { color: colors.text }]}>
              {item.issue_date}
            </Text>
          </View>
          <View style={[styles.dateColumn, styles.dateRight]}>
            <Text style={[styles.dateLabel, { color: colors.textMuted }]}>
              {item.return_id === 0 ? "Due Date" : "Returned"}
            </Text>
            <Text
              style={[
                styles.returnDate,
                {
                  color: item.return_id === 0 ? "#F59E0B" : colors.success,
                },
              ]}
            >
              {item.return_id === 0
                ? item.return_date
                : item.act_return_date || item.return_date}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSearchItem = ({ item }: { item: LibrarySearchResult }) => (
    <View style={[styles.searchBookCard, { backgroundColor: colors.surface }]}>
      <View style={styles.searchBookHeader}>
        <View
          style={[
            styles.searchBookIcon,
            { backgroundColor: colors.primary + "15" },
          ]}
        >
          <Book size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.searchBookTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.acc_title}
          </Text>
          {item.acc_edition && (
            <Text style={[styles.edition, { color: colors.textMuted }]}>
              Edition: {item.acc_edition}
            </Text>
          )}
        </View>
      </View>

      <Text style={[styles.authorText, { color: colors.textSecondary }]}>
        <Text style={{ fontWeight: "600" }}>Author: </Text>
        {item.acc_author || "N/A"}
      </Text>

      {item.acc_subject && (
        <Text style={[styles.subjectText, { color: colors.textMuted }]}>
          <Text style={{ fontWeight: "600" }}>Subject: </Text>
          {item.acc_subject}
        </Text>
      )}

      <View
        style={[
          styles.availabilitySection,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.availabilityItem}>
          <Text style={[styles.availabilityLabel, { color: colors.textMuted }]}>
            Total Copies
          </Text>
          <Text style={[styles.availabilityValue, { color: colors.text }]}>
            {item.tot_copy}
          </Text>
        </View>
        <View style={styles.availabilityDivider} />
        <View style={styles.availabilityItem}>
          <Text style={[styles.availabilityLabel, { color: colors.textMuted }]}>
            On Shelf
          </Text>
          <Text style={[styles.availabilityValue, { color: colors.success }]}>
            {item.tot_shelf}
          </Text>
        </View>
        <View style={styles.availabilityDivider} />
        <View style={styles.availabilityItem}>
          <Text style={[styles.availabilityLabel, { color: colors.textMuted }]}>
            Issued
          </Text>
          <Text style={[styles.availabilityValue, { color: "#F59E0B" }]}>
            {item.tot_issued}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.reserveButton,
          {
            backgroundColor: colors.primary,
            opacity: item.tot_shelf - item.tot_issued > 0 ? 1 : 0.5,
          },
        ]}
        onPress={() => handleReserve(item)}
        disabled={item.tot_shelf - item.tot_issued === 0}
      >
        <BookmarkPlus size={18} color="#fff" />
        <Text style={styles.reserveButtonText}>
          {item.tot_shelf - item.tot_issued > 0
            ? "Reserve Book"
            : "Not Available"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleBack} style={commonStyles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Library
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      {/* View Mode Switcher */}
      <View
        style={[styles.viewModeContainer, { backgroundColor: colors.surface }]}
      >
        <TouchableOpacity
          style={[
            styles.viewModeTab,
            viewMode === "my-books" && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setViewMode("my-books")}
        >
          <Text
            style={[
              styles.viewModeText,
              {
                color:
                  viewMode === "my-books"
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            My Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeTab,
            viewMode === "search" && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setViewMode("search")}
        >
          <Text
            style={[
              styles.viewModeText,
              {
                color:
                  viewMode === "search" ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            Search & Reserve
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === "my-books" ? (
        <>
          <View style={styles.filterContainer}>
            <View
              style={[styles.filterTabs, { backgroundColor: colors.surface }]}
            >
              <TouchableOpacity
                onPress={() => handleFilterChange("1")}
                style={[
                  styles.filterTab,
                  filterType === "1" && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: filterType === "1" ? "#fff" : colors.textSecondary,
                    },
                  ]}
                >
                  All Books
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFilterChange("2")}
                style={[
                  styles.filterTab,
                  filterType === "2" && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: filterType === "2" ? "#fff" : colors.textSecondary,
                    },
                  ]}
                >
                  To Return
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                Loading your books...
              </Text>
            </View>
          ) : books.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIconCircle,
                  { backgroundColor: colors.surface },
                ]}
              >
                <BookOpen size={48} color={colors.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Books Found
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {filterType === "1"
                  ? "You haven't borrowed any books yet"
                  : "No books pending return"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={books}
              renderItem={renderBookItem}
              keyExtractor={(item, index) => `${item.reader_acc_id}-${index}`}
              contentContainerStyle={[
                styles.listContainer,
                { paddingBottom: bottomOffset + 20 },
              ]}
            />
          )}
        </>
      ) : (
        /* SEARCH MODE */
        <>
          <ScrollView
            style={commonStyles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.searchContent}>
              {/* Search Info Card */}
              {!isSearchFocused && (
                <View
                  style={[
                    styles.searchInfoCard,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <View
                    style={[
                      styles.searchIconCircle,
                      { backgroundColor: colors.primary + "20" },
                    ]}
                  >
                    <Search size={32} color={colors.primary} />
                  </View>
                  <Text
                    style={[styles.searchInfoTitle, { color: colors.text }]}
                  >
                    Library Search
                  </Text>
                  <Text
                    style={[
                      styles.searchInfoDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Search for books by title, author, call number, or ISBN and
                    reserve them instantly.
                  </Text>
                </View>
              )}

              {/* Search Input Section */}
              <View style={styles.searchInputSection}>
                <View
                  style={[
                    styles.searchInputWrapper,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Search size={20} color={colors.textMuted} />
                  <TextInput
                    placeholder="Search for books..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        if (!filterClickRef.current) {
                          setIsSearchFocused(false);
                        }
                        filterClickRef.current = false;
                      }, 100);
                    }}
                    returnKeyType="search"
                    style={styles.searchInput}
                  />
                  <TouchableOpacity
                    style={[
                      styles.filterIconButton,
                      { backgroundColor: colors.primary + "15" },
                    ]}
                    onPress={() => {
                      setShowFilterDropdown(!showFilterDropdown);
                    }}
                    activeOpacity={0.7}
                  >
                    <Filter size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Filter Dropdown */}
                {showFilterDropdown && (
                  <View
                    style={[
                      styles.filterDropdown,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    {[
                      { field: "acc_title", label: "Title" },
                      { field: "acc_author_name", label: "Author" },
                      { field: "acc_call", label: "Call No" },
                      { field: "acc_isbn", label: "ISBN" },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.field}
                        style={[
                          styles.dropdownItem,
                          searchField === option.field && {
                            backgroundColor: colors.primary + "10",
                          },
                        ]}
                        onPress={() => {
                          setSearchField(option.field as LibrarySearchField);
                          setShowFilterDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            { color: colors.text },
                          ]}
                        >
                          {option.label}
                        </Text>
                        {searchField === option.field && (
                          <Check size={18} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Search Results */}
              {searchLoading ? (
                <View style={styles.searchLoadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text
                    style={[
                      styles.loadingText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Searching library...
                  </Text>
                </View>
              ) : searchResults.length > 0 ? (
                <>
                  <View
                    style={[
                      styles.resultsHeader,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <View style={styles.resultsIconContainer}>
                      <Sparkles size={20} color={colors.primary} />
                    </View>
                    <View style={styles.resultsTextContainer}>
                      <Text
                        style={[styles.resultsCount, { color: colors.text }]}
                      >
                        {searchResults.length}{" "}
                        {searchResults.length === 1 ? "Book" : "Books"} Found
                      </Text>
                      <Text
                        style={[
                          styles.resultsSubtext,
                          { color: colors.textMuted },
                        ]}
                      >
                        Tap to reserve available books
                      </Text>
                    </View>
                  </View>
                  {searchResults.map((item, index) => (
                    <View key={`${item.sl_no}-${index}`}>
                      {renderSearchItem({ item })}
                    </View>
                  ))}
                </>
              ) : searchQuery ? (
                <View style={styles.noResultsContainer}>
                  <View
                    style={[
                      styles.emptyIconCircle,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <Search size={48} color={colors.textMuted} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    No Results Found
                  </Text>
                  <Text
                    style={[styles.emptyText, { color: colors.textSecondary }]}
                  >
                    Try adjusting your search query or filter
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={{ height: bottomOffset + 20 }} />
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.headerRow,
    ...commonStyles.header,
    paddingBottom: 7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterTabs: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  bookCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  bookCover: {
    width: 80,
    height: 110,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  bookDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  bookTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: "65%",
  },
  bookTypeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dueIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dueText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F59E0B",
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    marginBottom: 4,
  },
  accNumber: {
    fontSize: 12,
    fontFamily: "monospace",
    marginBottom: 8,
  },
  dateSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  dateRight: {
    alignItems: "flex-end",
  },
  returnDate: {
    fontSize: 13,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
  viewModeContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  viewModeTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  viewModeText: {
    fontWeight: "600",
    fontSize: 14,
  },
  searchContent: {
    padding: 20,
  },
  searchInfoCard: {
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  searchIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInfoTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  searchInfoDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  searchInputSection: {
    marginBottom: 0,
    zIndex: 100,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    color: "#000",
    backgroundColor: "transparent",
  },
  filterIconButton: {
    padding: 8,
    borderRadius: 8,
  },
  filterDropdown: {
    position: "absolute",
    top: 55,
    right: 0,
    zIndex: 1000,
    borderRadius: 16,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  dropdownHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dropdownItemIcon: {
    fontSize: 18,
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  searchLoadingContainer: {
    paddingVertical: 48,
    alignItems: "center",
    gap: 16,
  },
  resultsHeader: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6" + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  resultsTextContainer: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
  },
  resultsSubtext: {
    fontSize: 12,
    fontWeight: "500",
  },
  searchBookCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  searchBookHeader: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  searchBookIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBookTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 4,
  },
  edition: {
    fontSize: 12,
    fontStyle: "italic",
  },
  authorText: {
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  subjectText: {
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  availabilitySection: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  availabilityItem: {
    flex: 1,
    alignItems: "center",
  },
  availabilityDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  availabilityLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  availabilityValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  reserveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  reserveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  noResultsContainer: {
    paddingVertical: 48,
    alignItems: "center",
    paddingHorizontal: 32,
  },
});
