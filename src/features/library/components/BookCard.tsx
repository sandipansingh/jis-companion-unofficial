import { useTheme } from "@/src/contexts/ThemeContext";
import { LibraryBook } from "@/src/features/library/api/library";
import { Book, Clock } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface BookCardProps {
  book: LibraryBook;
}

export function BookCard({ book }: BookCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.bookCard, { backgroundColor: colors.surface }]}>
      <View
        style={[
          styles.bookCover,
          {
            backgroundColor: colors.primary + "15",
            borderColor: colors.primary + "30",
          },
        ]}
      >
        <Book size={36} color={colors.primary} />
      </View>

      <View style={styles.bookDetails}>
        <View style={styles.bookHeader}>
          <View
            style={[
              styles.bookTypeBadge,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Text
              style={[styles.bookTypeText, { color: colors.primary }]}
              numberOfLines={1}
            >
              {book.acc_type}
            </Text>
          </View>
          {book.return_id === 0 && (
            <View style={[styles.dueIndicator, { backgroundColor: "#FEF3C7" }]}>
              <Clock size={12} color="#F59E0B" />
              <Text style={styles.dueText}>Due</Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.bookTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {book.reader_acc_name}
        </Text>

        <Text style={[styles.bookSubtitle, { color: colors.textSecondary }]}>
          Acc: {book.reader_acc_no}
        </Text>

        <View style={[styles.dateSection, { borderTopColor: colors.border }]}>
          <View style={styles.dateColumn}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Issued
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {book.issue_date}
            </Text>
          </View>

          <View style={[styles.dateColumn, styles.dateRight]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {book.return_id === 0 ? "Due Date" : "Returned"}
            </Text>
            <Text
              style={[
                styles.returnDate,
                {
                  color: book.return_id === 0 ? "#F59E0B" : "#10B981",
                },
              ]}
            >
              {book.return_id === 0
                ? book.return_date
                : book.act_return_date || book.return_date}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  bookCover: {
    width: 80,
    height: 110,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  bookDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  bookTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: "65%",
  },
  bookTypeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dueIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dueText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F59E0B",
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    marginBottom: 4,
  },
  bookSubtitle: {
    fontSize: 12,
    fontFamily: "monospace",
    marginBottom: 8,
  },
  dateSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
  },
  dateColumn: {
    flex: 1,
  },
  dateRight: {
    alignItems: "flex-end",
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  returnDate: {
    fontSize: 13,
    fontWeight: "700",
  },
});
