import { Sparkles } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface SearchResultsHeaderProps {
  count: number;
}

export function SearchResultsHeader({ count }: SearchResultsHeaderProps) {
  const { colors } = useTheme();
  return (
    <View
      className="flex-row items-center bg-surface dark:bg-surface rounded-2xl border border-border p-4 gap-3 mb-4"
      style={{
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        className="w-10 h-10 rounded-full border border-border items-center justify-center"
        style={{ backgroundColor: colors.ctaSoft }}
      >
        <Sparkles size={18} color={colors.cta} />
      </View>
      <View>
        <Text className="text-base text-ink-900 dark:text-white font-display">
          {count} {count === 1 ? 'Book' : 'Books'} Found
        </Text>
        <Text className="text-xs text-ink-500 dark:text-ink-400 font-sans">
          Tap to reserve available books
        </Text>
      </View>
    </View>
  );
}
