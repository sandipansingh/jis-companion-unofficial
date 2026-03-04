import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { EmptyState, ErrorState, Header } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';

import { PyqCard } from '../components/PyqCard';
import { PyqSearchBar } from '../components/PyqSearchBar';
import { usePyqData } from '../hooks/usePyqData';
import { COLLEGES, Pyq, PyqSearchFilter } from '../types';

function getEmptySearchMessage(query: string, filter: PyqSearchFilter) {
  const trimmed = query.trim();
  if (!trimmed) return 'No question papers available for this college';

  switch (filter) {
    case 'year':
      return `No question papers found for year ${trimmed}`;
    case 'semester':
      return `No question papers found for semester ${trimmed}`;
    case 'subjectCode':
      return `No question papers found for subject code "${trimmed}"`;
    case 'stream':
      return `No question papers found for stream "${trimmed}"`;
    case 'subjectName':
    default:
      return `No question papers found for subject "${trimmed}"`;
  }
}

function PyqSkeleton() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
      }}
    >
      <View className="flex-row items-start gap-3 mb-3">
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: colors.elevated,
          }}
        />
        <View className="flex-1 gap-2">
          <View
            style={{
              height: 14,
              borderRadius: 6,
              backgroundColor: colors.elevated,
              width: '75%',
            }}
          />
          <View
            style={{
              height: 10,
              borderRadius: 6,
              backgroundColor: colors.elevated,
              width: '40%',
            }}
          />
        </View>
      </View>
      <View className="flex-row gap-1.5">
        {[50, 60, 45, 70].map((w, i) => (
          <View
            key={i}
            style={{
              height: 20,
              width: w,
              borderRadius: 6,
              backgroundColor: colors.elevated,
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default function CollegePyqScreen() {
  const { college: collegeCode } = useLocalSearchParams<{ college: string }>();
  const { bottomOffset } = useSafeAreaStore();
  const { isDesktopWeb } = useBreakpoint();
  const { colors } = useTheme();

  const college = COLLEGES.find((c) => c.code === collegeCode);
  const title = college?.name ?? collegeCode ?? 'Question Papers';

  const {
    pyqs,
    initialLoading,
    loadingMore,
    error,
    searchQuery,
    searchFilter,
    setSearchQuery,
    handleEndReached,
    showLoadMore,
    retry,
  } = usePyqData(collegeCode ?? '');

  const renderItem = ({ item }: { item: Pyq }) => <PyqCard item={item} />;

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 20 }} />;
    return (
      <View className="items-center py-5">
        <ActivityIndicator size="small" color={colors.cta} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (initialLoading) return null;
    return <EmptyState message={getEmptySearchMessage(searchQuery, searchFilter)} />;
  };

  return (
    <View className="flex-1 bg-base">
      {isDesktopWeb ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator
          indicatorStyle="black"
        >
          <ContentContainer maxWidth={1280}>
            <Header title={title} showBackButton fallbackRoute="/pyq-hub" />

            <PyqSearchBar value={searchQuery} onChangeText={setSearchQuery} />

            {initialLoading ? (
              <View className="flex-row flex-wrap items-stretch">
                {Array.from({ length: 9 }).map((_, i) => (
                  <View key={i} className="w-1/3 flex-col">
                    <PyqSkeleton />
                  </View>
                ))}
              </View>
            ) : error ? (
              <ErrorState message={error} onRetry={retry} />
            ) : pyqs.length === 0 ? (
              <EmptyState message={getEmptySearchMessage(searchQuery, searchFilter)} />
            ) : (
              <View>
                <View className="flex-row flex-wrap items-stretch">
                  {pyqs.map((item) => (
                    <View key={item.$id} className="w-1/3 flex-col">
                      <PyqCard item={item} />
                    </View>
                  ))}
                </View>

                {loadingMore && (
                  <View className="items-center py-5">
                    <ActivityIndicator size="small" color={colors.cta} />
                    <Text className="text-xs text-ink-500 mt-2 font-sans">
                      Loading more...
                    </Text>
                  </View>
                )}

                {!loadingMore && showLoadMore && pyqs.length > 0 && (
                  <View className="items-center py-5">
                    <TouchableOpacity
                      onPress={handleEndReached}
                      activeOpacity={0.7}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 8,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <Text
                        className="text-[13px] font-sans-md"
                        style={{ color: colors.textSecondary }}
                      >
                        Load More
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </ContentContainer>
        </ScrollView>
      ) : (
        <>
          <Header title={title} showBackButton fallbackRoute="/pyq-hub" />

          <View className="pt-3">
            <PyqSearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>

          {initialLoading ? (
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator
              keyboardDismissMode="on-drag"
              contentContainerStyle={{ paddingTop: 4, paddingBottom: bottomOffset + 20 }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <PyqSkeleton key={i} />
              ))}
            </ScrollView>
          ) : error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : (
            <FlashList
              data={pyqs}
              renderItem={renderItem}
              keyExtractor={(item: Pyq) => item.$id}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmpty}
              contentContainerStyle={{ paddingTop: 4, paddingBottom: bottomOffset + 20 }}
              showsVerticalScrollIndicator
              keyboardDismissMode="on-drag"
            />
          )}
        </>
      )}
    </View>
  );
}
