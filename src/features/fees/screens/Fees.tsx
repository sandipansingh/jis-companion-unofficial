import {
  EmptyState,
  ErrorState,
  LoadingState,
  Text,
  View,
} from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { ScrollView, StyleSheet } from "react-native";
import { TransactionCard } from "../components";
import { useFeesData } from "../hooks";

export default function Fees() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const { feeData, loading, error, refreshFeeData } = useFeesData();

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[commonStyles.header, { backgroundColor: colors.surface }]}>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Fees & Dues
        </Text>
      </View>

      {loading ? (
        <LoadingState message="Loading fee details..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refreshFeeData} />
      ) : feeData.length === 0 ? (
        <EmptyState message="No transactions found" />
      ) : (
        <ScrollView
          style={commonStyles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottomOffset + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {feeData.map((transaction, index) => (
              <TransactionCard key={index} transaction={transaction} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 16,
  },
  content: {
    padding: 16,
    gap: 16,
  },
});
