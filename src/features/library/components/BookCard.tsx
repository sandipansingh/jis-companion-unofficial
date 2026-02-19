import { LibraryBook } from "@/src/features/library/api/library";
import { Book, Clock } from "lucide-react-native";
import { Text, View } from "react-native";

interface BookCardProps {
  book: LibraryBook;
}

export function BookCard({ book }: BookCardProps) {
  const isReturned = book.return_id !== 0;

  return (
    <View
      className="bg-surface dark:bg-surface rounded-2xl border border-border p-4 mb-4 flex-row gap-3.5"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Cover icon */}
      <View className="w-16 h-16 rounded-xl bg-cobalt-50 dark:bg-ink-900 border border-border items-center justify-center">
        <Book size={28} color="#2B5BDB" />
      </View>

      {/* Details */}
      <View className="flex-1">
        {/* Header row: type + due badge */}
        <View className="flex-row items-center justify-between mb-1.5">
          <View className="bg-cobalt-50 dark:bg-ink-800 border border-border rounded-full px-2.5 py-0.5">
            <Text
              className="text-[10px] text-cobalt-600 dark:text-cobalt-300 uppercase tracking-wider"
              style={{ fontFamily: "GeneralSans-Semibold" }}
              numberOfLines={1}
            >
              {book.acc_type}
            </Text>
          </View>
          {!isReturned && (
            <View className="flex-row items-center gap-1 bg-warning-light dark:bg-yellow-900/30 rounded-full px-2 py-0.5">
              <Clock size={10} color="#D97706" />
              <Text
                className="text-[10px] text-yellow-700 dark:text-yellow-500"
                style={{ fontFamily: "GeneralSans-Semibold" }}
              >
                Due
              </Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text
          className="text-sm text-ink-900 dark:text-white leading-snug mb-0.5"
          style={{ fontFamily: "GeneralSans-Semibold" }}
          numberOfLines={2}
        >
          {book.reader_acc_name}
        </Text>
        <Text
          className="text-xs text-ink-500 mb-2"
          style={{ fontFamily: "GeneralSans-Regular" }}
        >
          Acc: {book.reader_acc_no}
        </Text>

        {/* Dates row */}
        <View className="flex-row border-t border-border pt-2 gap-4">
          <View className="flex-1">
            <Text
              className="text-[9px] text-ink-500 uppercase tracking-widest mb-0.5"
              style={{ fontFamily: "GeneralSans-Semibold" }}
            >
              Issued
            </Text>
            <Text
              className="text-xs text-ink-800"
              style={{ fontFamily: "GeneralSans-Medium" }}
            >
              {book.issue_date}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text
              className="text-[9px] text-ink-500 uppercase tracking-widest mb-0.5"
              style={{ fontFamily: "GeneralSans-Semibold" }}
            >
              {isReturned ? "Returned" : "Due Date"}
            </Text>
            <Text
              className="text-xs"
              style={{
                fontFamily: "GeneralSans-Semibold",
                color: isReturned ? "#059669" : "#D97706",
              }}
            >
              {isReturned
                ? book.act_return_date || book.return_date
                : book.return_date}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
