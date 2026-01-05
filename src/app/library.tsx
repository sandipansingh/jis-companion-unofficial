import { LibraryFilterType } from "@/src/api/library";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { useAuthStore } from "@/src/store/authStore";
import { useLibraryStore } from "@/src/store/libraryStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { useRouter } from "expo-router";
import { Book, BookOpen, ChevronLeft, Clock } from "lucide-react-native";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
  } = useLibraryStore();

  useEffect(() => {
    if (studentId) {
      fetchBooks(studentId, filterType);
    }
  }, []);

  useEffect(() => {
    if (error) {
      showAlert({
        title: "Error",
        message: error,
        onConfirm: () => {
          clearError();
        },
      });
    }
  }, [error]);

  const handleFilterChange = (type: LibraryFilterType) => {
    if (type === filterType) return;

    setFilterType(type);
    if (studentId) {
      fetchBooks(studentId, type);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const bookList = books || [];

  const renderBookItem = ({ item }: { item: any }) => (
    <View style={[styles.bookCard, { backgroundColor: colors.surface }]}>
      {/* Book Cover Placeholder */}
      <View
        style={[
          styles.bookCover,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <Book size={32} color={colors.textMuted} />
      </View>

      <View style={styles.bookDetails}>
        <View style={styles.bookHeader}>
          <View
            style={[
              styles.bookTypeBadge,
              { backgroundColor: `${colors.primary}15` },
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
            <View style={styles.dueIndicator}>
              <Clock size={10} color="#F97316" />
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
          <View>
            <Text style={[styles.dateLabel, { color: colors.textMuted }]}>
              Issue Date
            </Text>
            <Text style={[styles.dateValue, { color: colors.textSecondary }]}>
              {item.issue_date}
            </Text>
          </View>
          <View style={styles.dateRight}>
            <Text style={[styles.dateLabel, { color: colors.textMuted }]}>
              {item.return_id === 0 ? "Return By" : "Returned On"}
            </Text>
            <Text
              style={[
                styles.returnDate,
                {
                  color:
                    item.return_id === 0 ? colors.primary : colors.success,
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

  if (loading && bookList.length === 0) {
    return (
      <View
        style={[commonStyles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={handleBack}
            style={commonStyles.backButton}
          >
            <ChevronLeft size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
            Library Books
          </Text>
          <View style={commonStyles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your books...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleBack} style={commonStyles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Library Books
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <View style={[styles.filterTabs, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={() => handleFilterChange("1")}
            style={[
              styles.filterTab,
              filterType === "1" && {
                backgroundColor: colors.primary,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filterType === "1" ? "#fff" : colors.textSecondary,
                },
              ]}
            >
              All Issued
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFilterChange("2")}
            style={[
              styles.filterTab,
              filterType === "2" && {
                backgroundColor: colors.primary,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filterType === "2" ? "#fff" : colors.textSecondary,
                },
              ]}
            >
              Pending Return
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Book List */}
      {bookList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIcon,
              {
                backgroundColor: colors.surface,
              },
            ]}
          >
            <BookOpen size={32} color={colors.textMuted} />
          </View>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No books found in this category
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookList}
          renderItem={renderBookItem}
          keyExtractor={(item, index) => `${item.reader_acc_id}-${index}`}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: bottomOffset + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        />
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
    paddingVertical: 8,
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
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  bookCover: {
    width: 80,
    height: 112,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  bookDetails: {
    flex: 1,
    paddingVertical: 4,
  },
  bookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  bookTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    maxWidth: "70%",
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
    backgroundColor: "transparent",
  },
  dueText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#F97316",
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 4,
  },
  accNumber: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  dateSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  dateLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateRight: {
    alignItems: "flex-end",
  },
  returnDate: {
    fontSize: 12,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
