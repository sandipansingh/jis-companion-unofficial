import { Text, View } from '@/src/components';
import { useTheme } from '@/src/contexts/ThemeContext';

interface SubjectRowProps {
  subject: string;
  obtained: number;
  full: number;
}

export function SubjectRow({ subject, obtained, full }: SubjectRowProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between py-1.5">
      <Text className="text-sm text-ink-900 dark:text-ink-200 font-sans-md">
        {subject}
      </Text>
      <Text className="text-sm font-sans-bold" style={{ color: colors.cta }}>
        {obtained}/{full}
      </Text>
    </View>
  );
}
