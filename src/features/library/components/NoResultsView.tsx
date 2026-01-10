import { useTheme } from "@/src/contexts/ThemeContext";
import { Search } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export function NoResultsView() {
  const { colors } = useTheme();

  return (
    <View style={styles.noResultsContainer}>
      <View
        style={[styles.emptyIconCircle, { backgroundColor: colors.surface }]}
      >
        <Search size={48} color={colors.textMuted} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Results Found
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Try adjusting your search query or filter
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noResultsContainer: {
    paddingVertical: 48,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
});
