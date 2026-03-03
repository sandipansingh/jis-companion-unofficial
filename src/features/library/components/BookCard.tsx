import { Book, Clock } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { LibraryBook } from '@/src/features/library/types';

interface BookCardProps {
  book: LibraryBook;
}

export function BookCard({ book }: BookCardProps) {
  const { colors } = useTheme();
  const isReturned = book.return_id !== 0;

  return (
    <View
      className="bg-surface dark:bg-surface rounded-2xl border border-border p-4 mb-4 flex-row gap-3.5"
      style={{
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="w-16 h-16 rounded-xl bg-cobalt-50 dark:bg-elevated border border-border items-center justify-center">
        <Book size={28} color={colors.primary} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1.5">
          <View className="bg-cobalt-50 dark:bg-ink-800 border border-border rounded-full px-2.5 py-0.5">
            <Text
              className="text-[10px] text-cobalt-600 dark:text-cobalt-300 uppercase tracking-wider font-sans-semi"
              numberOfLines={1}
            >
              {book.acc_type}
            </Text>
          </View>
          {!isReturned && (
            <View className="flex-row items-center gap-1 bg-warning-light dark:bg-yellow-900/30 rounded-full px-2 py-0.5">
              <Clock size={10} color={colors.warning} />
              <Text className="text-[10px] text-yellow-700 dark:text-yellow-500 font-sans-semi">
                Due
              </Text>
            </View>
          )}
        </View>

        <Text
          className="text-sm text-ink-900 dark:text-white leading-snug mb-0.5 font-sans-semi"
          numberOfLines={2}
        >
          {book.reader_acc_name}
        </Text>
        <Text className="text-xs text-ink-500 mb-2 font-sans">
          Acc: {book.reader_acc_no}
        </Text>

        <View className="flex-row border-t border-border pt-2 gap-4">
          <View className="flex-1">
            <Text className="text-[9px] text-ink-500 uppercase tracking-widest mb-0.5 font-sans-semi">
              Issued
            </Text>
            <Text className="text-xs text-ink-800 font-sans-md">{book.issue_date}</Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-[9px] text-ink-500 uppercase tracking-widest mb-0.5 font-sans-semi">
              {isReturned ? 'Returned' : 'Due Date'}
            </Text>
            <Text
              className="text-xs font-sans-semi"
              style={{
                color: isReturned ? colors.success : colors.warning,
              }}
            >
              {isReturned ? book.act_return_date || book.return_date : book.return_date}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
