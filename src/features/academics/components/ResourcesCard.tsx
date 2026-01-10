import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { FileText } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Resource {
  filename: string;
  url: string;
}

interface ResourcesCardProps {
  resources: Resource[];
  onResourcePress: (url: string) => void;
}

export function ResourcesCard({
  resources,
  onResourcePress,
}: ResourcesCardProps) {
  const { colors } = useTheme();

  if (resources.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Resources
        </Text>
      </View>
      <View style={styles.list}>
        {resources.map((resource, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => onResourcePress(resource.url)}
          >
            <View style={styles.icon}>
              <FileText size={20} color="#EF4444" />
            </View>
            <Text
              style={[styles.filename, { color: colors.text }]}
              numberOfLines={1}
            >
              {resource.filename}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  list: {
    gap: 12,
    backgroundColor: "transparent",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  filename: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});
