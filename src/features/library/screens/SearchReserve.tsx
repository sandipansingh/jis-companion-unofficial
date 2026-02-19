import { Header, TextInput } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { Filter, Search } from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
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
  const { bottomOffset } = useSafeAreaStore();
  const { isDark } = useTheme();
  const {
    searchResults,
    searchLoading,
    searchQuery,
    searchField,
    showFilterDropdown,
    hasSearched,
    isDemoUser,
    setSearchQuery,
    setSearchField,
    setShowFilterDropdown,
    handleSearch,
    handleReserve,
  } = useSearchReserveData();

  return (
    <View className="flex-1 bg-base">
      <Header title="Search & Reserve" showBackButton />

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="p-4 gap-4">
          <SearchInfoCard />

          {/* Search input row */}
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
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
              className="w-12 h-12 rounded-xl bg-cobalt-50 dark:bg-ink-900 border border-border items-center justify-center"
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
              activeOpacity={0.7}
            >
              <Filter size={18} color={isDark ? "#94A3B8" : "#2B5BDB"} />
            </TouchableOpacity>
          </View>

          {showFilterDropdown && (
            <FilterDropdown
              selectedField={searchField}
              onSelectField={(field) => {
                setSearchField(field);
                setShowFilterDropdown(false);
              }}
            />
          )}

          {searchLoading ? (
            <View className="items-center py-12 gap-3">
              <ActivityIndicator size="large" color="#2B5BDB" />
              <Text
                className="text-sm text-ink-500"
                style={{ fontFamily: "GeneralSans-Regular" }}
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
                  isDemoUser={isDemoUser}
                />
              ))}
            </>
          ) : hasSearched ? (
            <NoResultsView />
          ) : null}

          <View style={{ height: bottomOffset + 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}
