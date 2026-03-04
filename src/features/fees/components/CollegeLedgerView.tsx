import { Calendar } from 'lucide-react-native';
import { Pressable, ScrollView, Text } from 'react-native';

import { View } from '@/src/components';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';

import { FeeLedgerEntry } from '../types';
import { TransactionCard } from './TransactionCard';

const COL_WIDTHS = {
  sem: 80,
  date: 110,
  type: 0,
  billed: 110,
  paid: 110,
  balance: 110,
} as const;

function formatCurrency(amount: number): string {
  if (amount === 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

function headerCellStyle(colors: ReturnType<typeof useTheme>['colors']) {
  return {
    color: colors.textTertiary,
    letterSpacing: 0.7,
  };
}

function FeeRow({
  transaction,
  isLast,
  colors,
}: {
  transaction: FeeLedgerEntry;
  isLast: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const balance = transaction.bal_amt;
  const balanceColor =
    balance === 0
      ? colors.success
      : balance > 0
        ? colors.textSecondary
        : colors.textSecondary;

  return (
    <Pressable
      style={
        ((state: any) => ({
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: colors.border,
          backgroundColor: state.hovered ? colors.elevated : 'transparent',
          transition: 'background-color 120ms',
          cursor: 'default',
        })) as any
      }
    >
      <View style={{ width: COL_WIDTHS.sem }}>
        <View
          className="rounded-md self-start px-2 py-0.5"
          style={{ backgroundColor: colors.primary + '18' }}
        >
          <Text
            className="text-[11px] font-semibold font-sans"
            style={{ color: colors.primary }}
          >
            S{transaction.sem_name}
          </Text>
        </View>
      </View>

      <View
        style={{ width: COL_WIDTHS.date }}
        className="flex-row items-center gap-[5px]"
      >
        <Calendar size={12} color={colors.textTertiary} />
        <Text className="text-[13px] text-ink-500 font-sans">{transaction.vou_date}</Text>
      </View>

      <Text
        className="text-sm font-medium text-text font-sans flex-1 pr-3"
        numberOfLines={2}
      >
        {transaction.bill_type_name}
      </Text>

      <Text
        className="text-sm font-medium text-text font-sans text-right"
        style={{ width: COL_WIDTHS.billed }}
      >
        {formatCurrency(transaction.bill_amt)}
      </Text>

      <Text
        className="text-sm font-medium font-sans text-right"
        style={{ width: COL_WIDTHS.paid, color: colors.success }}
      >
        {formatCurrency(transaction.recd_amt)}
      </Text>

      <Text
        className="text-sm font-semibold font-sans text-right"
        style={{ width: COL_WIDTHS.balance, color: balanceColor }}
      >
        {formatCurrency(balance)}
      </Text>
    </Pressable>
  );
}

function FeesTable({
  transactions,
  colors,
}: {
  transactions: FeeLedgerEntry[];
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View className="bg-surface rounded-[20px] border border-border overflow-hidden">
      <View className="flex-row items-center px-5 py-3 border-b border-border bg-base">
        <Text
          className="text-[11px] font-sans-semi uppercase"
          style={[headerCellStyle(colors), { width: COL_WIDTHS.sem }]}
        >
          SEM
        </Text>
        <Text
          className="text-[11px] font-sans-semi uppercase"
          style={[headerCellStyle(colors), { width: COL_WIDTHS.date }]}
        >
          DATE
        </Text>
        <Text
          className="text-[11px] font-sans-semi uppercase"
          style={[headerCellStyle(colors), { flex: 1 }]}
        >
          TYPE
        </Text>
        <Text
          className="text-[11px] font-sans-semi uppercase"
          style={[
            headerCellStyle(colors),
            { width: COL_WIDTHS.billed, textAlign: 'right' },
          ]}
        >
          BILLED
        </Text>
        <Text
          className="text-[11px] font-sans-semi uppercase"
          style={[
            headerCellStyle(colors),
            { width: COL_WIDTHS.paid, textAlign: 'right' },
          ]}
        >
          PAID
        </Text>
        <Text
          className="text-[11px] font-sans-semi uppercase"
          style={[
            headerCellStyle(colors),
            { width: COL_WIDTHS.balance, textAlign: 'right' },
          ]}
        >
          BALANCE
        </Text>
      </View>

      {transactions.map((tx, index) => (
        <FeeRow
          key={index}
          transaction={tx}
          isLast={index === transactions.length - 1}
          colors={colors}
        />
      ))}
    </View>
  );
}

interface CollegeLedgerViewProps {
  transactions: FeeLedgerEntry[];
}

export function CollegeLedgerView({ transactions }: CollegeLedgerViewProps) {
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const { bottomOffset } = useSafeAreaStore();

  return isDesktopWeb ? (
    <FeesTable transactions={transactions} colors={colors} />
  ) : (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: bottomOffset + 100, gap: 12 }}
      showsVerticalScrollIndicator={false}
    >
      {transactions.map((transaction, index) => (
        <TransactionCard key={index} transaction={transaction} />
      ))}
    </ScrollView>
  );
}
