import { FlashList } from '@shopify/flash-list';
import { BookOpen } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { EmptyState, Header, LoadingState } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { getTabIndicatorColor, getTabLabelColor } from '@/src/constants/tabColors';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';

import { BookCard } from '../components';
import { LibraryTabs } from '../components/LibraryTabs';
import { useMyBooksData } from '../hooks';

const FILTER_TABS = [
  { key: '1', label: 'All Books' },
  { key: '2', label: 'To Return' },
];

export default function MyBooks() {
  const { bottomOffset } = useSafeAreaStore();
  const { colors, isDark } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const { books, loading, filterType, handleFilterChange } = useMyBooksData();

  if (isDesktopWeb) {
    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={1280}>
            <Header title="My Books" showBackButton fallbackRoute="/library" />

            <View className="flex-row gap-6 items-start">
              <View
                className="w-[200px] bg-surface rounded-xl border border-border overflow-hidden"
                style={{ position: 'sticky' as any, top: 24 }}
              >
                <View className="px-3.5 py-2.5 border-b border-border">
                  <Text className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.8px] font-sans">
                    Filter
                  </Text>
                </View>
                {FILTER_TABS.map((tab) => {
                  const isActive = filterType === tab.key;
                  return (
                    <Pressable
                      key={tab.key}
                      onPress={() => handleFilterChange(tab.key as any)}
                      style={({ hovered }: any) => ({
                        flexDirection: 'row' as const,
                        alignItems: 'center' as const,
                        paddingHorizontal: 14,
                        paddingVertical: 11,
                        backgroundColor: isActive
                          ? getTabIndicatorColor(isDark)
                          : hovered
                            ? colors.elevated
                            : 'transparent',
                        borderLeftWidth: 3,
                        borderLeftColor: isActive
                          ? getTabLabelColor(isDark, true)
                          : 'transparent',
                        cursor: 'pointer' as any,
                        transition: 'background-color 120ms',
                      })}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_400Regular',
                          color: isActive ? getTabLabelColor(isDark, true) : colors.text,
                        }}
                      >
                        {tab.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View className="flex-1 min-w-0">
                {loading ? (
                  <LoadingState message="Loading your books..." />
                ) : books.length === 0 ? (
                  <EmptyState
                    message={
                      filterType === '1'
                        ? "You haven't borrowed any books yet"
                        : 'No books pending return'
                    }
                    icon={BookOpen}
                  />
                ) : (
                  <View className="flex-row flex-wrap gap-4">
                    {books.map((book, index) => (
                      <View
                        key={`${book.reader_acc_id}-${index}`}
                        style={{ width: 'calc(50% - 8px)' as any }}
                      >
                        <BookCard book={book} />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </ContentContainer>
        </ScrollView>
      </View>
    );
  }

  const renderBookItem = ({ item }: { item: any }) => (
    <View className="px-4">
      <BookCard book={item} />
    </View>
  );

  return (
    <View className="flex-1 bg-base">
      <Header title="My Books" showBackButton />

      <View className="px-4 pt-4 pb-2">
        <LibraryTabs
          activeTab={filterType}
          onTabChange={(tab) => handleFilterChange(tab as any)}
        />
      </View>

      {loading ? (
        <LoadingState message="Loading your books..." />
      ) : books.length === 0 ? (
        <EmptyState
          message={
            filterType === '1'
              ? "You haven't borrowed any books yet"
              : 'No books pending return'
          }
          icon={BookOpen}
        />
      ) : (
        <FlashList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item: any, index: number) => `${item.reader_acc_id}-${index}`}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: bottomOffset + 20 }}
          showsVerticalScrollIndicator={true}
        />
      )}
    </View>
  );
}
