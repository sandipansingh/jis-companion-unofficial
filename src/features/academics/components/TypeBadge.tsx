import { Text, View } from 'react-native';

interface TypeBadgeProps {
  type: 'LAB' | 'THEORY';
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const isLab = type === 'LAB';
  return (
    <View
      className={`rounded-full px-4 py-2 ${
        isLab
          ? 'bg-warning-light dark:bg-yellow-900/30 border border-warning dark:border-yellow-700'
          : 'bg-ink-100 dark:bg-ink-800 border border-border'
      }`}
    >
      <Text
        className={`text-sm font-sans-semi ${
          isLab ? 'text-warning dark:text-yellow-400' : 'text-ink-500 dark:text-ink-400'
        }`}
      >
        {type}
      </Text>
    </View>
  );
}
