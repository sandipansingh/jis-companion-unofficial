import { Filter, Search } from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header, TextInput } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { getTabIndicatorColor, getTabLabelColor } from '@/src/constants/tabColors';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';

import {
  FilterDropdown,
  NoResultsView,
  SearchBookCard,
  SearchInfoCard,
  SearchResultsHeader,
} from '../components';
import { useSearchReserveData } from '../hooks';
import { LibrarySearchField } from '../types';

const SEARCH_FIELDS: { field: LibrarySearchField; label: string }[] = [
  { field: 'acc_title', label: 'Title' },
  { field: 'acc_author_name', label: 'Author' },
  { field: 'acc_call', label: 'Call No' },
  { field: 'acc_isbn', label: 'ISBN' },
];

export default function SearchReserve() {
  const { bottomOffset } = useSafeAreaStore();
  const { isDark, colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
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

  if (isDesktopWeb) {
    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ContentContainer maxWidth={1280}>
            <Header title="Search & Reserve" showBackButton fallbackRoute="/library" />

            <View className="flex-row gap-6 items-start">
              <View
                className="gap-4"
                style={{ width: 300, position: 'sticky' as any, top: 24 }}
              >
                <SearchInfoCard />

                <TextInput
                  icon={Search}
                  placeholder="Search books..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />

                <View className="bg-surface rounded-2xl border border-border overflow-hidden">
                  <View className="px-4 py-3 border-b border-border">
                    <Text className="text-[11px] font-semibold text-ink-400 uppercase tracking-[0.8px] font-sans">
                      Search By
                    </Text>
                  </View>
                  {SEARCH_FIELDS.map((opt) => {
                    const isSelected = searchField === opt.field;
                    return (
                      <Pressable
                        key={opt.field}
                        onPress={() => setSearchField(opt.field)}
                        style={({ hovered }: any) => ({
                          flexDirection: 'row' as const,
                          alignItems: 'center' as const,
                          paddingHorizontal: 16,
                          paddingVertical: 11,
                          backgroundColor: isSelected
                            ? getTabIndicatorColor(isDark)
                            : hovered
                              ? colors.elevated
                              : 'transparent',
                          borderLeftWidth: 3,
                          borderLeftColor: isSelected
                            ? getTabLabelColor(isDark, true)
                            : 'transparent',
                          cursor: 'pointer' as any,
                          transition: 'background-color 120ms',
                        })}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: isSelected
                              ? 'Inter_600SemiBold'
                              : 'Inter_400Regular',
                            color: isSelected
                              ? getTabLabelColor(isDark, true)
                              : colors.text,
                          }}
                          className="flex-1"
                        >
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  onPress={handleSearch}
                  style={({ pressed, hovered }: any) => ({
                    flexDirection: 'row' as const,
                    alignItems: 'center' as const,
                    justifyContent: 'center' as const,
                    gap: 8,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: pressed
                      ? colors.primary + 'CC'
                      : hovered
                        ? colors.primary + 'EE'
                        : colors.primary,

                    cursor: 'pointer' as any,
                    transition: 'background-color 120ms',
                  })}
                  accessibilityRole="button"
                >
                  <Search size={16} color="#fff" />
                  <Text className="text-sm font-semibold text-white font-sans">
                    Search
                  </Text>
                </Pressable>
              </View>

              <View className="flex-1 min-w-0 gap-3">
                {searchLoading ? (
                  <View className="items-center py-12 gap-3">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text className="text-sm text-ink-500 font-sans">
                      Searching library...
                    </Text>
                  </View>
                ) : searchResults.length > 0 ? (
                  <>
                    <SearchResultsHeader count={searchResults.length} />
                    <View className="flex-row gap-3">
                      <View className="flex-1 gap-3">
                        {searchResults
                          .filter((_, i) => i % 2 === 0)
                          .map((item, index) => (
                            <SearchBookCard
                              key={`${item.sl_no}-${index * 2}`}
                              book={item}
                              onReserve={handleReserve}
                              isDemoUser={isDemoUser}
                            />
                          ))}
                      </View>
                      <View className="flex-1 gap-3">
                        {searchResults
                          .filter((_, i) => i % 2 !== 0)
                          .map((item, index) => (
                            <SearchBookCard
                              key={`${item.sl_no}-${index * 2 + 1}`}
                              book={item}
                              onReserve={handleReserve}
                              isDemoUser={isDemoUser}
                            />
                          ))}
                      </View>
                    </View>
                  </>
                ) : hasSearched ? (
                  <NoResultsView />
                ) : (
                  <View className="items-center py-12 gap-3">
                    <Search size={40} color={colors.border} />
                    <Text className="text-[15px] font-medium text-ink-500 font-sans">
                      Enter a search term to find books
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ContentContainer>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <Header title="Search & Reserve" showBackButton />

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="p-4 gap-4">
          <SearchInfoCard />

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
              className="w-12 h-12 rounded-xl bg-cobalt-50 dark:bg-elevated border border-border items-center justify-center"
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
              activeOpacity={0.7}
            >
              <Filter size={18} color={isDark ? colors.textTertiary : colors.primary} />
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
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-sm text-ink-500 font-sans">Searching library...</Text>
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
