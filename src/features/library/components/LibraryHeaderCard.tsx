import { useTheme } from "@/src/contexts/ThemeContext";
import { Book } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface LibraryHeaderCardProps {
  title: string;
  description: string;
}

export function LibraryHeaderCard({
  title,
  description,
}: LibraryHeaderCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.headerCard, { backgroundColor: colors.surface }]}>
      <View
        style={[styles.iconCircle, { backgroundColor: colors.primary + "20" }]}
      >
        <Book size={48} color={colors.primary} />
      </View>
      <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.headerDescription, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: 24,
    padding: 32,
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
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  headerDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
