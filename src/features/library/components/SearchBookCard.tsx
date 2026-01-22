import { useTheme } from "@/src/contexts/ThemeContext";
import { Book, BookmarkPlus } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LibrarySearchResult } from "../api";

interface SearchBookCardProps {
  book: LibrarySearchResult;
  onReserve: (book: LibrarySearchResult) => void;
  isDemoUser?: boolean;
}

export function SearchBookCard({
  book,
  onReserve,
  isDemoUser = false,
}: SearchBookCardProps) {
  const { colors } = useTheme();
  const isAvailable = book.tot_shelf - book.tot_issued > 0;

  return (
    <View
      style={[
        styles.searchBookCard,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
    >
      <View style={styles.searchBookHeader}>
        <View
          style={[
            styles.searchBookIcon,
            { backgroundColor: colors.primary + "15" },
          ]}
        >
          <Book size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.searchBookTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {book.acc_title}
          </Text>
          {book.acc_edition && (
            <Text style={[styles.edition, { color: colors.textMuted }]}>
              Edition: {book.acc_edition}
            </Text>
          )}
        </View>
      </View>

      <Text style={[styles.authorText, { color: colors.textSecondary }]}>
        <Text style={{ fontWeight: "600" }}>Author: </Text>
        {book.acc_author || "N/A"}
      </Text>

      {book.acc_subject && (
        <Text style={[styles.subjectText, { color: colors.textMuted }]}>
          <Text style={{ fontWeight: "600" }}>Subject: </Text>
          {book.acc_subject}
        </Text>
      )}

      <View
        style={[
          styles.availabilitySection,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.availabilityItem}>
          <Text style={[styles.availabilityLabel, { color: colors.textMuted }]}>
            Total Copies
          </Text>
          <Text style={[styles.availabilityValue, { color: colors.text }]}>
            {book.tot_copy}
          </Text>
        </View>
        <View
          style={[
            styles.availabilityDivider,
            { backgroundColor: colors.gray200 },
          ]}
        />
        <View style={styles.availabilityItem}>
          <Text style={[styles.availabilityLabel, { color: colors.textMuted }]}>
            On Shelf
          </Text>
          <Text style={[styles.availabilityValue, { color: colors.success }]}>
            {book.tot_shelf}
          </Text>
        </View>
        <View
          style={[
            styles.availabilityDivider,
            { backgroundColor: colors.gray200 },
          ]}
        />
        <View style={styles.availabilityItem}>
          <Text style={[styles.availabilityLabel, { color: colors.textMuted }]}>
            Issued
          </Text>
          <Text style={[styles.availabilityValue, { color: colors.warning }]}>
            {book.tot_issued}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.reserveButton,
          {
            backgroundColor: colors.primary,
            opacity: isAvailable && !isDemoUser ? 1 : 0.5,
            shadowColor: colors.shadow,
          },
        ]}
        onPress={() => onReserve(book)}
        disabled={!isAvailable || isDemoUser}
      >
        <BookmarkPlus size={18} color={colors.surface} />
        <Text style={[styles.reserveButtonText, { color: colors.surface }]}>
          {isDemoUser
            ? "Demo Mode - View Only"
            : isAvailable
              ? "Reserve Book"
              : "Not Available"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBookCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  searchBookHeader: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  searchBookIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBookTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 4,
  },
  edition: {
    fontSize: 12,
    fontStyle: "italic",
  },
  authorText: {
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  subjectText: {
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  availabilitySection: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  availabilityItem: {
    flex: 1,
    alignItems: "center",
  },
  availabilityDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  availabilityLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  availabilityValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  reserveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  reserveButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
