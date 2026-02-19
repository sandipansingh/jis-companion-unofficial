import { Book, BookmarkPlus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { LibrarySearchResult } from "../api";

interface SearchBookCardProps {
  book: LibrarySearchResult;
  onReserve: (book: LibrarySearchResult) => void;
  isDemoUser?: boolean;
}

export function SearchBookCard({ book, onReserve, isDemoUser = false }: SearchBookCardProps) {
  const isAvailable = book.tot_shelf - book.tot_issued > 0;

  return (
    <View
      className="bg-surface dark:bg-surface rounded-2xl border border-border p-5 mb-4"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View className="flex-row gap-3.5 mb-3">
        <View className="w-12 h-12 rounded-xl bg-cobalt-50 dark:bg-ink-900 border border-border items-center justify-center">
          <Book size={22} color="#2B5BDB" />
        </View>
        <View className="flex-1">
          <Text
            className="text-base text-ink-900 dark:text-white leading-snug mb-0.5"
            style={{ fontFamily: "GeneralSans-Semibold" }}
            numberOfLines={2}
          >
            {book.acc_title}
          </Text>
          {book.acc_edition && (
            <Text
              className="text-xs text-ink-400 dark:text-ink-500 italic"
              style={{ fontFamily: "GeneralSans-Regular" }}
            >
              Edition: {book.acc_edition}
            </Text>
          )}
        </View>
      </View>

      {/* Author/Subject */}
      <Text
        className="text-sm text-ink-600 dark:text-ink-300 mb-1"
        style={{ fontFamily: "GeneralSans-Regular" }}
      >
        <Text style={{ fontFamily: "GeneralSans-Semibold" }}>Author: </Text>
        {book.acc_author || "N/A"}
      </Text>
      {book.acc_subject && (
        <Text
          className="text-sm text-ink-500 dark:text-ink-400 mb-3"
          style={{ fontFamily: "GeneralSans-Regular" }}
        >
          <Text style={{ fontFamily: "GeneralSans-Semibold" }}>Subject: </Text>
          {book.acc_subject}
        </Text>
      )}

      {/* Availability grid */}
      <View className="flex-row bg-ink-100 dark:bg-ink-900 rounded-xl p-3 mb-3 gap-2">
        <View className="flex-1 items-center">
          <Text className="text-[9px] text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-0.5" style={{ fontFamily: "GeneralSans-Semibold" }}>
            Total
          </Text>
          <Text className="text-xl text-ink-800 dark:text-white" style={{ fontFamily: "ClashDisplay-Bold" }}>
            {book.tot_copy}
          </Text>
        </View>
        <View className="w-px bg-ink-300/50 dark:bg-ink-700" />
        <View className="flex-1 items-center">
          <Text className="text-[9px] text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-0.5" style={{ fontFamily: "GeneralSans-Semibold" }}>
            On Shelf
          </Text>
          <Text className="text-xl text-green-700 dark:text-green-500" style={{ fontFamily: "ClashDisplay-Bold" }}>
            {book.tot_shelf}
          </Text>
        </View>
        <View className="w-px bg-ink-300/50 dark:bg-ink-700" />
        <View className="flex-1 items-center">
          <Text className="text-[9px] text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-0.5" style={{ fontFamily: "GeneralSans-Semibold" }}>
            Issued
          </Text>
          <Text className="text-xl text-yellow-700 dark:text-yellow-500" style={{ fontFamily: "ClashDisplay-Bold" }}>
            {book.tot_issued}
          </Text>
        </View>
      </View>

      {/* Reserve button */}
      <TouchableOpacity
        className={`flex-row items-center justify-center gap-2 py-3 rounded-xl ${
          isAvailable && !isDemoUser ? "bg-cobalt-500" : "bg-ink-200"
        }`}
        style={{
          opacity: isAvailable && !isDemoUser ? 1 : 0.6,
          shadowColor: isAvailable ? "#2B5BDB" : "transparent",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: isAvailable && !isDemoUser ? 4 : 0,
        }}
        onPress={() => onReserve(book)}
        disabled={!isAvailable || isDemoUser}
        activeOpacity={0.8}
      >
        <BookmarkPlus size={16} color={isAvailable && !isDemoUser ? "#FFFFFF" : "#94A3B8"} />
        <Text
          className={`text-sm ${isAvailable && !isDemoUser ? "text-white" : "text-ink-500"}`}
          style={{ fontFamily: "GeneralSans-Semibold" }}
        >
          {isDemoUser ? "Demo Mode – View Only" : isAvailable ? "Reserve Book" : "Not Available"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
