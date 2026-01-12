import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Image, StyleSheet } from "react-native";
import { RegistrationRollInfo } from "./RegistrationRollInfo";

interface ProfileInfoProps {
  profileImageUrl?: string;
  name?: string;
  studentId?: string;
  semester?: string | number;
  registrationNo?: string;
  rollNo?: string;
  getInitials: (name: string) => string;
}

export function ProfileInfo({
  profileImageUrl,
  name,
  studentId,
  semester,
  registrationNo,
  rollNo,
  getInitials,
}: ProfileInfoProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.profileHeader}>
      {profileImageUrl ? (
        <Image
          source={{ uri: profileImageUrl }}
          style={[styles.profileImage, { borderColor: colors.purpleLight }]}
        />
      ) : (
        <View
          style={[
            styles.profileImage,
            styles.profilePlaceholder,
            {
              backgroundColor: colors.primary + "30",
              borderColor: colors.purpleLight,
            },
          ]}
        >
          <Text style={[styles.placeholderText, { color: colors.primary }]}>
            {getInitials(name || "Student")}
          </Text>
        </View>
      )}
      <Text style={[styles.name, { color: colors.text }]}>
        {name || "Student"}
      </Text>

      <View style={styles.idRow}>
        <Text style={[styles.studentIdText, { color: colors.primary }]}>
          {studentId || "N/A"}
        </Text>
        <View style={[styles.dot, { backgroundColor: colors.slateDark }]} />
        <View style={[styles.semBadge, { backgroundColor: colors.infoLight }]}>
          <Text style={[styles.semBadgeText, { color: colors.primary }]}>
            SEMESTER {semester || "N/A"}
          </Text>
        </View>
      </View>

      <RegistrationRollInfo registrationNo={registrationNo} rollNo={rollNo} />
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "transparent",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 4,
  },
  profilePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  studentIdText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  semBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  semBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
