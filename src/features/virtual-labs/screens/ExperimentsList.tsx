import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { EmptyState, Header, LoadingState } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';

import { ExperimentGroup } from '../components';
import { useExperimentsData } from '../hooks/useExperimentsData';

/** Group a flat experiment list by subject_code, preserving insertion order. */
function groupBySubjectCode(experiments: any[]) {
  const map = new Map<string, any[]>();
  for (const exp of experiments) {
    const key = exp.subject_code ?? 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(exp);
  }
  return Array.from(map.entries()).map(([subjectCode, items]) => ({
    subjectCode,
    items,
  }));
}

export default function ExperimentsList() {
  const { bottomOffset } = useSafeAreaStore();
  const { isDesktopWeb } = useBreakpoint();
  const { experiments, loading, handleExperimentPress } = useExperimentsData();

  const groups = useMemo(() => groupBySubjectCode(experiments), [experiments]);

  if (isDesktopWeb) {
    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={1280}>
            <Header
              title="Available Experiments"
              showBackButton
              fallbackRoute="/virtual-labs"
            />

            {loading ? (
              <LoadingState message="Loading experiments..." />
            ) : experiments.length === 0 ? (
              <EmptyState message="No experiments available" />
            ) : (
              <View>
                {groups.map(({ subjectCode, items }) => (
                  <ExperimentGroup
                    key={subjectCode}
                    subjectCode={subjectCode}
                    experiments={items}
                    onExperimentPress={handleExperimentPress}
                    columns={3}
                    isDesktopWeb
                  />
                ))}
              </View>
            )}
          </ContentContainer>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <Header title="Available Experiments" showBackButton />

      {loading ? (
        <LoadingState message="Loading experiments..." />
      ) : experiments.length === 0 ? (
        <EmptyState message="No experiments available" />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: bottomOffset + 20 }}
          showsVerticalScrollIndicator
        >
          {groups.map(({ subjectCode, items }) => (
            <ExperimentGroup
              key={subjectCode}
              subjectCode={subjectCode}
              experiments={items}
              onExperimentPress={handleExperimentPress}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
