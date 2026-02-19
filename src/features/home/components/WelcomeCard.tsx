import { useTheme } from "@/src/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { ActivityIndicator, Image, Platform, Text, TouchableOpacity, View } from "react-native";

interface WelcomeCardProps {
  userName: string;
  profileImageUrl?: string;
  courseName: string;
  collegeName: string;
  attendancePercentage: number;
  attendedClass: number;
  totalClass: number;
  loadingAttendance: boolean;
}

export function WelcomeCard({
  userName,
  profileImageUrl,
  courseName,
  collegeName,
  attendancePercentage,
  attendedClass,
  totalClass,
  loadingAttendance,
}: WelcomeCardProps) {
  const { isDark, colors } = useTheme();
  const firstName = userName.split(" ")[0] || "Student";

  const getInitials = (name: string) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const router = useRouter();

  const attendanceColor =
    attendancePercentage >= 75
      ? "#10B981"
      : attendancePercentage >= 60
      ? "#F59E0B"
      : "#EF4444";

  return (
    <LinearGradient
      colors={isDark ? ["#1E293B", "#0F172A"] : ["#FFFFFF", "#F4F7FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: Platform.select({ web: 24, default: 64 }),
        paddingBottom: 28,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: isDark ? "#000" : "#0F172A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      {/* Top row: greeting + avatar */}
      <View className="flex-row items-start justify-between mb-6">
        <View className="flex-1 pr-4">
          <Text
            className="text-xs text-ink-500 dark:text-ink-400 tracking-widest uppercase mb-1"
            style={{ fontFamily: "GeneralSans-Medium" }}
          >
            Welcome back
          </Text>
          <Text
            className="text-[28px] text-ink-950 dark:text-ink-100 leading-tight"
            style={{ fontFamily: "ClashDisplay-Bold" }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {firstName}
          </Text>
          <View className="flex-row items-center gap-1.5 mt-2 flex-wrap">
            <View className="bg-cobalt-50 dark:bg-cobalt-900 rounded-full px-2.5 py-0.5 border border-border">
              <Text
                className="text-[11px] text-cobalt-600 dark:text-cobalt-300"
                style={{ fontFamily: "GeneralSans-Medium" }}
              >
                {courseName}
              </Text>
            </View>
            <View className="w-1 h-1 rounded-full bg-ink-400" />
            <View className="bg-ink-200 dark:bg-ink-800 rounded-full px-2.5 py-0.5">
              <Text
                className="text-[11px] text-ink-600 dark:text-ink-300"
                style={{ fontFamily: "GeneralSans-Medium" }}
              >
                {collegeName}
              </Text>
            </View>

          </View>
        </View>

        {/* Avatar and Settings */}
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => router.push("/settings")}
            className="w-10 h-10 rounded-full bg-white/50 items-center justify-center border border-white/60"
          >
            <Settings size={20} color="#1E293B" />
          </TouchableOpacity>

          <View
            className="rounded-2xl"
            style={{
              shadowColor: "#2B5BDB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                className="w-16 h-16 rounded-2xl"
                style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.9)" }}
              />
            ) : (
              <View className="w-16 h-16 rounded-2xl bg-cobalt-500 items-center justify-center">
                <Text
                  className="text-xl text-white"
                  style={{ fontFamily: "ClashDisplay-Semibold" }}
                >
                  {getInitials(userName)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Attendance stat row */}
      <View
        className="flex-row gap-3"
      >
        <View
          className="flex-1 bg-white dark:bg-ink-900 rounded-2xl p-4"
          style={{
            borderWidth: 1,
            borderColor: "rgba(203,213,225,0.5)",
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text
            className="text-[10px] text-ink-500  dark:text-ink-400 uppercase tracking-widest mb-1"
            style={{ fontFamily: "GeneralSans-Medium" }}
          >
            Attendance
          </Text>
          {loadingAttendance ? (
            <ActivityIndicator size="small" color="#2B5BDB" />
          ) : (
            <Text
              className="text-3xl"
              style={{
                fontFamily: "ClashDisplay-Bold",
                color: attendanceColor,
              }}
            >
              {attendancePercentage}
              <Text
                style={{
                  fontFamily: "GeneralSans-Regular",
                  fontSize: 16,
                  color: "#94A3B8",
                }}
              >
                %
              </Text>
            </Text>
          )}
        </View>

        <View
          className="flex-1 bg-white dark:bg-ink-900 rounded-2xl p-4"
          style={{
            borderWidth: 1,
            borderColor: "rgba(203,213,225,0.5)",
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text
            className="text-[10px] text-ink-500  dark:text-ink-400 uppercase tracking-widest mb-1"
            style={{ fontFamily: "GeneralSans-Medium" }}
          >
            Classes
          </Text>
          {loadingAttendance ? (
            <ActivityIndicator size="small" color="#2B5BDB" />
          ) : (
            <View className="flex-row items-end gap-1">
              <Text
                className="text-3xl text-ink-950 dark:text-ink-100"
                style={{ fontFamily: "ClashDisplay-Bold" }}
              >
                {attendedClass}
              </Text>
              <Text
                className="text-base text-ink-400 dark:text-ink-500 mb-1"
                style={{ fontFamily: "GeneralSans-Regular" }}
              >
                /{totalClass}
              </Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
