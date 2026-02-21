import {
  EmptyState,
  ErrorState,
  Header,
  LoadingState,
  View,
} from "@/src/components";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { ScrollView } from "react-native";
import { TransactionCard } from "../components";
import { useFeesData } from "../hooks";

export default function Fees() {
  const { bottomOffset } = useSafeAreaStore();
  const { feeData, loading, error, refreshFeeData } = useFeesData();

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
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: bottomOffset + 100 }}
          showsVerticalScrollIndicator={true}
        >
          <View className="p-4 gap-4">
            {feeData.map((transaction, index) => (
              <TransactionCard key={index} transaction={transaction} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
