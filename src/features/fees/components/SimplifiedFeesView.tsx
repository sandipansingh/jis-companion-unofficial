import {
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Receipt,
  Wallet,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';

import { FeeLedgerEntry } from '../types';
import { FeesSummaryCard } from './FeesSummaryCard';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function fmt(amount: number): string {
  if (amount === 0) return '₹0';
  return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
}

function parseDateLabel(dateStr: string): string {
  try {
    // Try DD-MM-YYYY or DD/MM/YYYY
    const dmy = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (dmy) {
      const d = new Date(
        parseInt(dmy[3], 10),
        parseInt(dmy[2], 10) - 1,
        parseInt(dmy[1], 10),
      );
      return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    }
  } catch {
    /* fall through */
  }
  return dateStr;
}

function getSortKey(dateStr: string): string {
  try {
    const dmy = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {
    /* fall through */
  }
  return dateStr;
}

function TxIcon({ typeName, iconColor }: { typeName: string; iconColor: string }) {
  const lower = typeName.toLowerCase();
  if (lower.includes('coll') || lower.includes('receipt') || lower.includes('paid')) {
    return <Wallet size={14} color={iconColor} />;
  }
  if (lower.includes('bill')) {
    return <Receipt size={14} color={iconColor} />;
  }
  return <FileText size={14} color={iconColor} />;
}

interface TxRowProps {
  transaction: FeeLedgerEntry;
  isLast: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}

function TxRow({ transaction, isLast, colors }: TxRowProps) {
  const hasBilled = transaction.bill_amt !== 0;
  const hasPaid = transaction.recd_amt !== 0;

  const iconColor = hasPaid ? colors.success : colors.textTertiary;

  return (
    <View
      className={`flex-row items-center px-4 py-3.5 gap-3 ${!isLast ? 'border-b border-border' : ''}`}
    >
      <View
        className="w-8 h-8 rounded-xl items-center justify-center shrink-0"
        style={{ backgroundColor: iconColor + '18' }}
      >
        <TxIcon typeName={transaction.bill_type_name} iconColor={iconColor} />
      </View>

      <View className="flex-1 gap-0.5">
        <Text
          className="text-sm font-medium text-text font-sans leading-snug"
          numberOfLines={2}
        >
          {transaction.bill_type_name}
        </Text>
        {transaction.vou_date ? (
          <View className="flex-row items-center gap-1">
            <Calendar size={11} color={colors.textTertiary} />
            <Text className="text-[11px] text-ink-500 dark:text-ink-400 font-sans tabular-nums">
              {transaction.vou_date}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="items-end gap-0.5 shrink-0">
        {hasBilled ? (
          <View className="flex-row items-center gap-1">
            <Text className="text-[10px] text-ink-500 dark:text-ink-400 font-sans uppercase tracking-wider">
              Billed
            </Text>
            <Text className="text-[13px] font-semibold text-text font-sans tabular-nums">
              {fmt(transaction.bill_amt)}
            </Text>
          </View>
        ) : null}
        {hasPaid ? (
          <View className="flex-row items-center gap-1">
            <Text className="text-[10px] text-ink-500 dark:text-ink-400 font-sans uppercase tracking-wider">
              Paid
            </Text>
            <Text className="text-[13px] font-semibold text-emerald-500 dark:text-emerald-400 font-sans tabular-nums">
              {fmt(transaction.recd_amt)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

interface MonthGroupProps {
  label: string;
  transactions: FeeLedgerEntry[];
  defaultExpanded?: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}

function MonthGroup({
  label,
  transactions,
  defaultExpanded = false,
  colors,
}: MonthGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'),
      );
    }
    setExpanded((v) => !v);
  }, []);

  const totalBilled = transactions.reduce((s, t) => s + t.bill_amt, 0);
  const totalPaid = transactions.reduce((s, t) => s + t.recd_amt, 0);

  return (
    <View className="bg-surface rounded-2xl border border-border overflow-hidden">
      <Pressable
        onPress={toggle}
        className="flex-row items-center px-4 py-3.5 gap-3"
        style={({ pressed }: any) => ({
          backgroundColor: pressed ? colors.elevated : 'transparent',
          ...(Platform.OS === 'web'
            ? { cursor: 'pointer', transition: 'background-color 120ms' }
            : {}),
        })}
      >
        <Text className="flex-1 text-[13px] font-semibold text-text font-sans tracking-tight">
          {label}
        </Text>

        <View className="flex-row items-center gap-2 mr-3">
          {totalBilled !== 0 ? (
            <Text className="text-[12px] text-ink-500 dark:text-ink-400 font-sans tabular-nums">
              {fmt(totalBilled)} billed
            </Text>
          ) : null}
          {totalPaid !== 0 ? (
            <Text className="text-[12px] text-emerald-500 dark:text-emerald-400 font-sans tabular-nums">
              {fmt(totalPaid)} paid
            </Text>
          ) : null}
        </View>

        {expanded ? (
          <ChevronUp size={16} color={colors.textTertiary} />
        ) : (
          <ChevronDown size={16} color={colors.textTertiary} />
        )}
      </Pressable>

      {expanded ? (
        <View className="border-t border-border">
          {transactions.map((tx, idx) => (
            <TxRow
              key={idx}
              transaction={tx}
              isLast={idx === transactions.length - 1}
              colors={colors}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

interface SimplifiedFeesViewProps {
  transactions: FeeLedgerEntry[];
}

export function SimplifiedFeesView({ transactions }: SimplifiedFeesViewProps) {
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const { bottomOffset } = useSafeAreaStore();

  const groups = useMemo(() => {
    const map = new Map<
      string,
      { label: string; sortKey: string; items: FeeLedgerEntry[] }
    >();
    transactions.forEach((tx) => {
      const label = parseDateLabel(tx.vou_date);
      const sortKey = getSortKey(tx.vou_date);
      if (!map.has(label)) {
        map.set(label, { label, sortKey, items: [] });
      }
      map.get(label)!.items.push(tx);
    });
    return Array.from(map.values()).sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  }, [transactions]);

  const content = (
    <>
      <FeesSummaryCard transactions={transactions} />

      <View className="gap-2 mt-1">
        <Text className="text-[10px] font-semibold tracking-[0.9px] uppercase font-sans text-ink-500 dark:text-ink-400 ml-0.5">
          Transaction History
        </Text>
        {groups.map((group, i) => (
          <MonthGroup
            key={group.label}
            label={group.label}
            transactions={group.items}
            defaultExpanded={i === 0}
            colors={colors}
          />
        ))}
      </View>
    </>
  );

  return isDesktopWeb ? (
    <View className="gap-5">{content}</View>
  ) : (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: bottomOffset + 100,
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  );
}
