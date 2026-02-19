import { Calendar } from "lucide-react-native";
import { Text, View } from "react-native";
import { FeeLedgerEntry } from "../api";

interface TransactionCardProps {
  transaction: FeeLedgerEntry;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount === 0) return "₹0";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <View
      className="bg-white dark:bg-ink-900 rounded-2xl overflow-hidden border border-border"
      style={{
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Header Row: Semester & Date */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <View className="flex-row items-center gap-2">
          <View className="bg-ink-100 dark:bg-ink-800 px-2.5 py-1 rounded-md">
            <Text
              className="text-[10px] text-ink-600 dark:text-ink-300 uppercase tracking-wider"
              style={{ fontFamily: "GeneralSans-Semibold" }}
            >
              Sem {transaction.sem_name}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5 ml-1">
            <Calendar size={12} color="#94A3B8" />
            <Text
              className="text-[11px] text-ink-400 dark:text-ink-500"
              style={{ fontFamily: "GeneralSans-Medium" }}
            >
              {transaction.vou_date}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="p-4">
        <Text
          className="text-[15px] text-ink-900 dark:text-ink-100 mb-5 leading-tight"
          style={{ fontFamily: "ClashDisplay-Semibold" }}
        >
          {transaction.bill_type_name}
        </Text>

        {/* Stats Grid */}
        <View className="flex-row items-center justify-between">
          {/* Billed Column */}
          <View>
            <Text
              className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-1"
              style={{ fontFamily: "GeneralSans-Medium" }}
            >
              Billed
            </Text>
            <Text
              className="text-sm text-ink-700 dark:text-ink-300"
              style={{ fontFamily: "ClashDisplay-Medium" }}
            >
              {formatCurrency(transaction.bill_amt)}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-8 w-[1px] bg-ink-100 dark:bg-ink-800" />

          {/* Paid Column */}
          <View>
            <Text
              className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-1"
              style={{ fontFamily: "GeneralSans-Medium" }}
            >
              Paid
            </Text>
            <Text
              className="text-sm text-ink-700 dark:text-ink-300"
              style={{ fontFamily: "ClashDisplay-Medium" }}
            >
              {formatCurrency(transaction.recd_amt)}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-8 w-[1px] bg-ink-100 dark:bg-ink-800" />


          {/* Balance Column */}
          <View>
            <Text
              className="text-[10px] uppercase tracking-wider text-ink-400 mb-1 text-right"
              style={{ fontFamily: "GeneralSans-Medium" }}
            >
              Balance
            </Text>
            <Text
              className="text-sm text-ink-700"
              style={{ fontFamily: "ClashDisplay-Medium" }}
            >
              {formatCurrency(transaction.bal_amt)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
