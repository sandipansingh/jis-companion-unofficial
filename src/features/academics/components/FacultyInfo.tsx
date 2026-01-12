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
      <View style={[styles.box, { backgroundColor: colors.gray100 }]}>
        <View style={[styles.avatar, { backgroundColor: colors.indigoLight }]}>
          <Text style={[styles.avatarText, { color: colors.indigo }]}>
            {getInitials(facultyName)}
          </Text>
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
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
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
