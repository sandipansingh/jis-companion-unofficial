import { ScrollView } from 'react-native';

import { EmptyState, ErrorState, Header, LoadingState, View } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

import { CollegeLedgerView } from '../components/CollegeLedgerView';
import { FeesViewToggle } from '../components/FeesViewToggle';
import { SimplifiedFeesView } from '../components/SimplifiedFeesView';
import { useFeesData } from '../hooks';
import { useFeesViewMode } from '../hooks/useFeesViewMode';

export default function Fees() {
  const { isDesktopWeb } = useBreakpoint();
  const { feeData, loading, error, refreshFeeData } = useFeesData();
  const { viewMode, setViewMode } = useFeesViewMode();

  if (isDesktopWeb) {
    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={1100}>
            <Header title="Fees & Dues" />

            {loading ? (
              <LoadingState message="Loading fee details..." />
            ) : error ? (
              <ErrorState message={error} onRetry={refreshFeeData} />
            ) : feeData.length === 0 ? (
              <EmptyState message="No transactions found" />
            ) : (
              <View className="gap-5">
                <FeesViewToggle viewMode={viewMode} onChangef={setViewMode} />
                {viewMode === 'college' ? (
                  <CollegeLedgerView transactions={feeData} />
                ) : (
                  <SimplifiedFeesView transactions={feeData} />
                )}
              </View>
            )}
          </ContentContainer>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <Header title="Fees & Dues" />

      {loading ? (
        <LoadingState message="Loading fee details..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refreshFeeData} />
      ) : feeData.length === 0 ? (
        <EmptyState message="No transactions found" />
      ) : (
        <>
          {viewMode === 'college' ? (
            <CollegeLedgerView transactions={feeData} />
          ) : (
            <SimplifiedFeesView transactions={feeData} />
          )}
        </>
      )}
    </View>
  );
}
