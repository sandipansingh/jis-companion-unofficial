import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Calendar } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { FeeLedgerEntry } from "../api";

interface TransactionCardProps {
  transaction: FeeLedgerEntry;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const { colors } = useTheme();

  return (
    <View
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
              style={[styles.semesterText, { color: colors.textSecondary }]}
            >
              SEMESTER {transaction.sem_name}
            </Text>
          </View>
        </View>
        <View style={styles.inlineInfo}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={[styles.inlineLabel, { color: colors.textSecondary }]}>
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
          <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
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
        style={[styles.balanceFooter, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
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
  );
}

const styles = StyleSheet.create({
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
