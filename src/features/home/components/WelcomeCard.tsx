import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Image, Platform, StyleSheet } from "react-native";

interface WelcomeCardProps {
  userName: string;
  profileImageUrl?: string;
  courseName: string;
  collegeName: string;
  attendancePercentage: number;
  attendedDays: number;
  totalDays: number;
  loadingAttendance: boolean;
}

export function WelcomeCard({
  userName,
  profileImageUrl,
  courseName,
  collegeName,
  attendancePercentage,
  attendedDays,
  totalDays,
  loadingAttendance,
}: WelcomeCardProps) {
  const { colors } = useTheme();

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <LinearGradient
      colors={[colors.primary, "#222a68"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.welcomeCard}
    >
      <View style={styles.welcomeHeader}>
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.avatarContainer}
          />
        ) : (
          <View style={styles.avatarContainer}>
            <Text style={[styles.avatarText, { color: colors.surface }]}>
              {getInitials(userName)}
            </Text>
          </View>
        )}
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeSubtext}>Welcome back,</Text>
          <Text style={[styles.welcomeName, { color: colors.surface }]}>
            {userName}
          </Text>
          <Text style={styles.welcomeCourse}>
            {courseName} • {collegeName}
          </Text>
        </View>
      </View>

      <View style={styles.quickStatsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Attendance</Text>
          {loadingAttendance ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text style={[styles.statValue, { color: colors.surface }]}>
              {attendancePercentage}%
            </Text>
          )}
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Days</Text>
          {loadingAttendance ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text style={[styles.statValue, { color: colors.surface }]}>
              {attendedDays}/{totalDays}
            </Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    paddingHorizontal: 24,
    paddingTop: Platform.select({ web: 20, default: 60 }),
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  welcomeTextContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  welcomeCourse: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  quickStatsContainer: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
