import { Text, View, type ReactNode } from 'react-native';

interface LegalSectionProps {
  title: string;
  children: ReactNode;
  isHeader?: boolean;
}

export function LegalSection({ title, children, isHeader }: LegalSectionProps) {
  if (isHeader) {
    return (
      <View className="gap-2">
        <Text className="text-[28px] leading-[34px] font-display-bold text-ink-950 dark:text-ink-100">
          {title}
        </Text>
        <Text className="text-xs text-ink-500 dark:text-ink-400 font-sans">
          Effective Date: February 21, 2026
        </Text>
        {children}
      </View>
    );
  }

  return (
    <View className="gap-2">
      <Text className="text-lg leading-6 font-display text-ink-900 dark:text-ink-100">
        {title}
      </Text>
      {children}
    </View>
  );
}
