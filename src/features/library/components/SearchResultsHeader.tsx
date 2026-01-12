import { useTheme } from "@/src/contexts/ThemeContext";
import { Sparkles } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface SearchResultsHeaderProps {
  count: number;
}

export function SearchResultsHeader({ count }: SearchResultsHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.resultsHeader,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
    >
      <View
        style={[
          styles.resultsIconContainer,
          { backgroundColor: colors.info + "15" },
        ]}
      >
        <Sparkles size={20} color={colors.primary} />
      </View>
      <View style={styles.resultsTextContainer}>
        <Text style={[styles.resultsCount, { color: colors.text }]}>
          {count} {count === 1 ? "Book" : "Books"} Found
        </Text>
        <Text style={[styles.resultsSubtext, { color: colors.textMuted }]}>
          Tap to reserve available books
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultsHeader: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsTextContainer: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
  },
  resultsSubtext: {
    fontSize: 12,
    fontWeight: "500",
  },
});
