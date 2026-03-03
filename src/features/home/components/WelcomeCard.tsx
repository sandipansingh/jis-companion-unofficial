import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

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
  const firstName = userName.split(' ')[0] || 'Student';

  const getInitials = (name: string) => {
    if (!name?.trim()) return 'ST';
    const initials = name
      .trim()
      .split(' ')
      .filter((p) => p.length > 0)
      .map((p) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    return initials || 'ST';
  };

  const router = useRouter();

  const attendanceColor =
    attendancePercentage >= 75
      ? colors.success
      : attendancePercentage >= 60
        ? colors.warning
        : colors.danger;

  return (
    <LinearGradient
      colors={
        isDark ? [colors.surface, colors.surface] : [colors.surface, colors.elevated]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: Platform.select({ web: 24, default: 64 }),
        paddingBottom: 28,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: isDark ? colors.base : colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      <View className="flex-row items-start justify-between mb-6">
        <View className="flex-1 pr-4">
          <Text className="text-xs text-ink-500 dark:text-ink-400 tracking-widest uppercase mb-1 font-sans-md">
            Welcome back
          </Text>
          <Text
            className="text-[28px] text-ink-950 dark:text-ink-100 leading-tight font-display-bold"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {firstName}
          </Text>
          <View className="flex-row items-center gap-1.5 mt-2 flex-wrap">
            <View className="bg-cobalt-50 dark:bg-cobalt-900/30 rounded-full px-2.5 py-0.5 border border-cobalt-100 dark:border-cobalt-800/50">
              <Text className="text-[11px] text-cobalt-600 dark:text-cobalt-300 font-sans-md">
                {courseName}
              </Text>
            </View>
            <View className="w-1 h-1 rounded-full bg-ink-400" />
            <View className="bg-ink-200 dark:bg-ink-800 rounded-full px-2.5 py-0.5">
              <Text className="text-[11px] text-ink-600 dark:text-ink-300 font-sans-md">
                {collegeName}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            className="w-10 h-10 rounded-full bg-white/50 dark:bg-ink-700/50 items-center justify-center border border-white/60 dark:border-ink-600/60"
          >
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>

          <View className="rounded-2xl">
            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                contentFit="cover"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: colors.border,
                }}
              />
            ) : (
              <View className="w-16 h-16 rounded-2xl bg-cobalt-500 items-center justify-center border-2 border-border">
                <Text className="text-xl text-white font-display">
                  {getInitials(userName)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row gap-3">
        <View
          className="flex-1 bg-surface dark:bg-elevated rounded-2xl p-4"
          style={{
            borderWidth: 1,
            borderColor: 'rgba(203,213,225,0.5)',
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text className="text-[10px] text-ink-500  dark:text-ink-400 uppercase tracking-widest mb-1 font-sans-md">
            Attendance
          </Text>
          {loadingAttendance ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text
              className="text-3xl font-display-bold"
              style={{
                color: attendanceColor,
              }}
            >
              {attendancePercentage}
              <Text className="text-base text-ink-500 font-sans">%</Text>
            </Text>
          )}
        </View>

        <View
          className="flex-1 bg-surface dark:bg-elevated rounded-2xl p-4"
          style={{
            borderWidth: 1,
            borderColor: 'rgba(203,213,225,0.5)',
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text className="text-[10px] text-ink-500  dark:text-ink-400 uppercase tracking-widest mb-1 font-sans-md">
            Classes
          </Text>
          {loadingAttendance ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <View className="flex-row items-end gap-1">
              <Text className="text-3xl text-ink-950 dark:text-ink-100 font-display-bold">
                {attendedClass}
              </Text>
              <Text className="text-base text-ink-400 dark:text-ink-500 mb-1 font-sans">
                /{totalClass}
              </Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
