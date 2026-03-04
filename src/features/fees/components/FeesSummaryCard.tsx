import { BadgeCheck, CreditCard, TrendingDown, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { device } from '@/src/hooks/useDevice';

import { FeeLedgerEntry } from '../types';

function fmt(amount: number): string {
  if (amount === 0) return '₹0';
  return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
}

interface StatTileProps {
  label: string;
  value: string;
  toneClass: string;
  iconColor: string;
  icon: React.ReactNode;
  isDesktop: boolean;
}

function StatTile({
  label,
  value,
  toneClass,
  iconColor,
  icon,
  isDesktop,
}: StatTileProps) {
  return (
    <View
      className={`${isDesktop ? 'flex-1' : 'flex-1 min-w-[140px]'} bg-surface rounded-2xl border border-border p-4 gap-2`}
      style={
        !device.isWeb
          ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
            }
          : undefined
      }
    >
      <View className="flex-row items-center gap-2">
        <View
          className="w-7 h-7 rounded-lg items-center justify-center"
          style={{ backgroundColor: iconColor + '20' }}
        >
          {icon}
        </View>
        <Text
          className="text-[11px] uppercase tracking-widest font-sans-semi text-ink-500 dark:text-ink-400 flex-1"
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      <Text className={`text-xl font-bold font-display tabular-nums ${toneClass}`}>
        {value}
      </Text>
    </View>
  );
}

interface StatusBannerProps {
  latestBalance: number;
  colors: ReturnType<typeof useTheme>['colors'];
}

function StatusBanner({ latestBalance, colors }: StatusBannerProps) {
  let bg: string;
  let textColor: string;
  let borderColor: string;
  let message: string;
  let icon: React.ReactNode;

  if (latestBalance === 0) {
    bg = colors.successBg;
    textColor = colors.successText;
    borderColor = colors.success + '30';
    message = "You're all clear — no dues pending.";
    icon = <BadgeCheck size={15} color={colors.success} />;
  } else if (latestBalance > 0) {
    bg = colors.warningBg;
    textColor = colors.warningText;
    borderColor = colors.warning + '30';
    message = `You have ${fmt(latestBalance)} pending for this semester.`;
    icon = <TrendingDown size={15} color={colors.warning} />;
  } else {
    // balance < 0 means advance credit
    bg = colors.surface;
    textColor = colors.text;
    borderColor = colors.border;
    message = `You have ${fmt(latestBalance)} advance credit on account.`;
    icon = <TrendingUp size={15} color={colors.textSecondary} />;
  }

  return (
    <View
      className="flex-row items-center gap-2.5 rounded-2xl px-4 py-3 border"
      style={{ backgroundColor: bg, borderColor }}
    >
      {icon}
      <Text className="text-sm font-medium flex-1 font-sans" style={{ color: textColor }}>
        {message}
      </Text>
    </View>
  );
}

interface FeesSummaryCardProps {
  transactions: FeeLedgerEntry[];
}

export function FeesSummaryCard({ transactions }: FeesSummaryCardProps) {
  const { colors } = useTheme();
  const { isDesktopWeb, isMd } = useBreakpoint();

  if (transactions.length === 0) return null;

  const totalBilled = transactions.reduce((sum, t) => sum + t.bill_amt, 0);
  const totalPaid = transactions.reduce((sum, t) => sum + t.recd_amt, 0);
  const latestBalance = transactions[transactions.length - 1].bal_amt;

  const hasAdvance = latestBalance < 0;
  const hasPending = latestBalance > 0;

  const outstandingLabel = hasAdvance ? 'Advance Credit' : 'Outstanding';
  const outstandingValue = fmt(latestBalance);
  const outstandingToneClass = hasAdvance
    ? 'text-blue-400 dark:text-blue-400'
    : hasPending
      ? 'text-amber-400 dark:text-amber-400'
      : 'text-emerald-400 dark:text-emerald-400';
  const outstandingIconColor = hasAdvance
    ? colors.info
    : hasPending
      ? colors.warning
      : colors.success;
  const outstandingIcon = hasAdvance ? (
    <TrendingUp size={14} color={outstandingIconColor} />
  ) : hasPending ? (
    <TrendingDown size={14} color={outstandingIconColor} />
  ) : (
    <BadgeCheck size={14} color={outstandingIconColor} />
  );

  const tiles = (
    <>
      <StatTile
        label="Total Billed"
        value={fmt(totalBilled)}
        toneClass="text-text dark:text-text"
        iconColor={colors.primary}
        icon={<CreditCard size={14} color={colors.primary} />}
        isDesktop={isDesktopWeb}
      />
      <StatTile
        label="Total Paid"
        value={fmt(totalPaid)}
        toneClass="text-emerald-500 dark:text-emerald-400"
        iconColor={colors.success}
        icon={<BadgeCheck size={14} color={colors.success} />}
        isDesktop={isDesktopWeb}
      />
      <StatTile
        label={outstandingLabel}
        value={outstandingValue}
        toneClass={outstandingToneClass}
        iconColor={outstandingIconColor}
        icon={outstandingIcon}
        isDesktop={isDesktopWeb}
      />
    </>
  );

  return (
    <View className="gap-3">
      {isDesktopWeb || isMd ? (
        <View className="flex-row gap-3">{tiles}</View>
      ) : (
        <View className="flex-row flex-wrap gap-3">{tiles}</View>
      )}

      <StatusBanner latestBalance={latestBalance} colors={colors} />
    </View>
  );
}
