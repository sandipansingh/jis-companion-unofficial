import { Text } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet, View } from "react-native";

interface FacultyInfoProps {
  facultyName: string;
}

export function FacultyInfo({ facultyName }: FacultyInfoProps) {
  const { colors } = useTheme();

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <View style={styles.section}>
      <View style={styles.box}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(facultyName)}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Faculty
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {facultyName}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 8,
    backgroundColor: "transparent",
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#C7D2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
});
