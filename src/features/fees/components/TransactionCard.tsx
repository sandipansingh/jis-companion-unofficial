import { Calendar } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

import { FeeLedgerEntry } from '../types';

interface TransactionCardProps {
  transaction: FeeLedgerEntry;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const { isDark, colors } = useTheme();

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <View
      className="bg-surface dark:bg-surface rounded-2xl overflow-hidden border border-border"
      style={{
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <View className="flex-row items-center gap-2">
          <View className="bg-ink-100 dark:bg-ink-800 px-2.5 py-1 rounded-md">
            <Text className="text-[10px] text-ink-600 dark:text-ink-300 uppercase tracking-wider font-sans-semi">
              Sem {transaction.sem_name}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5 ml-1">
            <Calendar size={12} color={isDark ? colors.ink[500] : colors.ink[400]} />
            <Text className="text-[11px] text-ink-400 dark:text-ink-500 font-sans-md">
              {transaction.vou_date}
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        <Text className="text-[15px] text-ink-900 dark:text-ink-100 mb-5 leading-tight font-display">
          {transaction.bill_type_name}
        </Text>

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-1 font-sans-md">
              Billed
            </Text>
            <Text className="text-sm text-ink-700 dark:text-ink-300 font-display-md">
              {formatCurrency(transaction.bill_amt)}
            </Text>
          </View>

          <View className="h-8 w-[1px] bg-ink-100 dark:bg-ink-800" />

          <View>
            <Text className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-1 font-sans-md">
              Paid
            </Text>
            <Text className="text-sm text-emerald-500 dark:text-emerald-400 font-display-md">
              {formatCurrency(transaction.recd_amt)}
            </Text>
          </View>

          <View className="h-8 w-[1px] bg-ink-100 dark:bg-ink-800" />

          <View>
            <Text className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-1 text-right font-sans-md">
              Balance
            </Text>
            <Text className="text-sm text-ink-700 dark:text-ink-300 font-display-md">
              {formatCurrency(transaction.bal_amt)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
