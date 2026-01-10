import { useTheme } from "@/src/contexts/ThemeContext";
import { Search } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export function SearchInfoCard() {
  const { colors } = useTheme();

  return (
    <View style={[styles.searchInfoCard, { backgroundColor: colors.surface }]}>
      <View
        style={[
          styles.searchIconCircle,
          { backgroundColor: colors.primary + "20" },
        ]}
      >
        <Search size={32} color={colors.primary} />
      </View>
      <Text style={[styles.searchInfoTitle, { color: colors.text }]}>
        Library Search
      </Text>
      <Text
        style={[styles.searchInfoDescription, { color: colors.textSecondary }]}
      >
        Search for books by title, author, call number, or ISBN and reserve them
        instantly.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  searchInfoCard: {
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  searchIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInfoTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  searchInfoDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
