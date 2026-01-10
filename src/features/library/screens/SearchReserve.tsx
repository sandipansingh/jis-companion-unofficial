import { TextInput } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { useRouter } from "expo-router";
import { ChevronLeft, Filter, Search } from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FilterDropdown,
  NoResultsView,
  SearchBookCard,
  SearchInfoCard,
  SearchResultsHeader,
} from "../components";
import { useSearchReserveData } from "../hooks";

export default function SearchReserve() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const router = useRouter();
  const {
    searchResults,
    searchLoading,
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
  } = useSearchReserveData();

  const handleBack = () => {
    router.back();
  };

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleBack} style={commonStyles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Search & Reserve
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      <ScrollView
        style={commonStyles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchContent}>
          <SearchInfoCard />

          {/* Search Input Section */}
          <View style={styles.searchInputSection}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  icon={Search}
                  placeholder="Search for books..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
              </View>
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
              <FilterDropdown
                selectedField={searchField}
                onSelectField={(field) => {
                  setSearchField(field);
                  setShowFilterDropdown(false);
                }}
              />
            )}
          </View>

          {/* Search Results */}
          {searchLoading ? (
            <View style={styles.searchLoadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                Searching library...
              </Text>
            </View>
          ) : searchResults.length > 0 ? (
            <>
              <SearchResultsHeader count={searchResults.length} />
              {searchResults.map((item, index) => (
                <SearchBookCard
                  key={`${item.sl_no}-${index}`}
                  book={item}
                  onReserve={handleReserve}
                />
              ))}
            </>
          ) : hasSearched ? (
            <NoResultsView />
          ) : null}
        </View>
        <View style={{ height: bottomOffset + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.headerRow,
    ...commonStyles.header,
    paddingBottom: 7,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  searchContent: {
    padding: 20,
  },
  searchInputSection: {
    marginBottom: 0,
    zIndex: 100,
  },
  filterIconButton: {
    padding: 12,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  searchLoadingContainer: {
    paddingVertical: 48,
    alignItems: "center",
    gap: 16,
  },
});
gap: 16;
