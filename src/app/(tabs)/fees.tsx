import { Text, View } from "@/src/components/Themed";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useFeesStore } from "@/src/store/feesStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { Calendar } from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function FeesScreen() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const { feeData, loading, error, fetchFeeData, fromCache, isOnline } =
    useFeesStore();

  useEffect(() => {
    fetchFeeData();
  }, []);

  const loadFeeLedger = async () => {
    await fetchFeeData();
  };

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Fees & Dues
        </Text>
      </View>

      {loading ? (
        <View style={commonStyles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[commonStyles.loadingText, { color: colors.textSecondary }]}
          >
            Loading fee details...
          </Text>
        </View>
      ) : error ? (
        <View style={commonStyles.centerContainer}>
          <Text style={[commonStyles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[
              commonStyles.retryButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={loadFeeLedger}
          >
            <Text style={commonStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : feeData.length === 0 ? (
        <View style={commonStyles.centerContainer}>
          <Text
            style={[commonStyles.emptyText, { color: colors.textSecondary }]}
          >
            No transactions found
          </Text>
        </View>
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
              <View
                key={index}
                style={[
                  styles.transactionCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Date and Semester Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.inlineInfo}>
                    <View
                      style={[
                        styles.semesterBox,
                        { backgroundColor: colors.borderLight },
                      ]}
                    >
                      <Text
                        style={[
                          styles.semesterText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        SEMESTER {transaction.sem_name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.inlineInfo}>
                    <Calendar size={16} color={colors.textSecondary} />
                    <Text
                      style={[
                        styles.inlineLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {transaction.vou_date}
                    </Text>
                  </View>
                </View>

                {/* Transaction Type */}
                <Text style={[styles.transactionType, { color: colors.text }]}>
                  {transaction.bill_type_name}
                </Text>

                {/* Amounts Grid */}
                <View style={styles.amountsGrid}>
                  <View style={styles.amountBox}>
                    <Text
                      style={[
                        styles.amountLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Billed Amount
                    </Text>
                    <Text style={[styles.amountValue, { color: "#F97316" }]}>
                      ₹
                      {transaction.bill_amt > 0
                        ? transaction.bill_amt.toLocaleString("en-IN")
                        : "0"}
                    </Text>
                  </View>

                  <View style={styles.amountBoxRight}>
                    <Text
                      style={[
                        styles.amountLabel,
                        styles.amountLabelRight,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Received Amount
                    </Text>
                    <Text
                      style={[
                        styles.amountValue,
                        styles.amountValueRight,
                        { color: "#10B981" },
                      ]}
                    >
                      ₹
                      {transaction.recd_amt > 0
                        ? transaction.recd_amt.toLocaleString("en-IN")
                        : "0"}
                    </Text>
                  </View>
                </View>

                {/* Balance Footer */}
                <View
                  style={[
                    styles.balanceFooter,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Text
                    style={[
                      styles.balanceLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Outstanding Balance
                  </Text>
                  <Text
                    style={[
                      styles.balanceValue,
                      {
                        color: transaction.bal_amt > 0 ? "#EF4444" : "#10B981",
                      },
                    ]}
                  >
                    ₹{transaction.bal_amt.toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.header,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 16,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  transactionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  inlineInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  semesterBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  semesterText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  inlineLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  semBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  semBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    lineHeight: 22,
  },
  amountsGrid: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
    marginBottom: 12,
  },
  amountBox: {
    flex: 1,
    backgroundColor: "transparent",
    gap: 6,
  },
  amountBoxRight: {
    flex: 1,
    backgroundColor: "transparent",
    gap: 6,
    alignItems: "flex-end",
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amountLabelRight: {
    textAlign: "right",
  },
  amountValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  amountValueRight: {
    textAlign: "right",
  },
  balanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "700",
  },
});
