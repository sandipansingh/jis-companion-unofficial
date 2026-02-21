import { EmptyState, Header, LoadingState } from "@/src/components";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { ExperimentCard } from "../components";
import { useExperimentsData } from "../hooks/useExperimentsData";

export default function ExperimentsList() {
  const { bottomOffset } = useSafeAreaStore();
  const { experiments, loading, handleExperimentPress } = useExperimentsData();

  const renderItem = ({ item }: { item: any }) => (
    <ExperimentCard
      serialNumber={item.sl}
      subjectCode={item.subject_code}
      experimentName={item.experiment}
      onPress={() => handleExperimentPress(item.link)}
    />
  );

  return (
    <View className="flex-1 bg-base">
      <Header title="Available Experiments" showBackButton />

      {loading ? (
        <LoadingState message="Loading experiments..." />
      ) : experiments.length === 0 ? (
        <EmptyState message="No experiments available" />
      ) : (
        <FlashList
          data={experiments}
          renderItem={renderItem}
          keyExtractor={(item: any, index: number) => `${item.sl}-${index}`}
          contentContainerStyle={{ padding: 16, paddingBottom: bottomOffset + 20 }}
          showsVerticalScrollIndicator={true}
        />
      )}
    </View>
  );
}
