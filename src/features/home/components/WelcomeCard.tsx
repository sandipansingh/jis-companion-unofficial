import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

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
  const { isDesktopWeb } = useBreakpoint();
  const router = useRouter();

  const firstName = userName.split(' ')[0] || 'Student';

  const getInitials = (name: string) => {
    if (!name?.trim()) return 'ST';
    return (
      name
        .trim()
        .split(' ')
        .filter((p) => p.length > 0)
        .map((p) => p[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'ST'
    );
  };

  const attendanceColor =
    attendancePercentage >= 75
      ? colors.success
      : attendancePercentage >= 60
        ? colors.warning
        : colors.danger;

  if (isDesktopWeb) {
    const statusLabel =
      attendancePercentage >= 75
        ? 'On Track'
        : attendancePercentage >= 60
          ? 'At Risk'
          : 'Critical';

    return (
      <View className="pt-8 pb-7 border-b border-border mb-7">
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1 pr-8">
            <Text
              className="text-xs font-sans-md uppercase mb-1"
              style={{ color: colors.textSecondary, letterSpacing: 2 }}
            >
              Welcome back
            </Text>

            <Text
              className="font-display mb-3 text-[32px]"
              style={{ color: colors.text, letterSpacing: -0.5 }}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {firstName}
            </Text>

            <View className="flex-row items-center gap-2 flex-wrap">
              <View
                className="rounded-full px-2.5 py-1 border"
                style={{ backgroundColor: colors.ctaSoft, borderColor: colors.border }}
              >
                <Text className="text-xs font-sans-md" style={{ color: colors.cta }}>
                  {courseName}
                </Text>
              </View>

              <View className="w-1 h-1 rounded-full bg-ink-400" />

              <View className="rounded-full px-2.5 py-1 bg-ink-200 dark:bg-ink-800">
                <Text className="text-xs font-sans-md text-ink-600 dark:text-ink-300">
                  {collegeName}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              className="w-11 h-11 rounded-xl items-center justify-center border border-border bg-black/[0.04] dark:bg-white/[0.06]"
              accessibilityLabel="Open settings"
              accessibilityRole="button"
            >
              <Settings size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                contentFit="cover"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: colors.border,
                }}
              />
            ) : (
              <View
                className="items-center justify-center border-2"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  backgroundColor: colors.cobalt[500],
                  borderColor: colors.border,
                }}
              >
                <Text className="text-xl font-display text-white">
                  {getInitials(userName)}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 bg-surface rounded-2xl p-5 border border-border">
            <Text
              style={{ color: colors.textSecondary }}
              className="text-[10px] font-sans-md uppercase tracking-[1.5px] mb-2"
            >
              Attendance
            </Text>
            {loadingAttendance ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <View className="flex-row items-baseline gap-0.5">
                <Text
                  className="text-[34px] font-display-bold leading-[38px]"
                  style={{ color: attendanceColor }}
                >
                  {attendancePercentage}
                </Text>
                <Text
                  className="text-lg font-sans mb-0.5"
                  style={{ color: colors.textSecondary }}
                >
                  %
                </Text>
              </View>
            )}
          </View>

          <View className="flex-1 bg-surface rounded-2xl p-5 border border-border">
            <Text
              style={{ color: colors.textSecondary }}
              className="text-[10px] font-sans-md uppercase tracking-[1.5px] mb-2"
            >
              Classes Attended
            </Text>
            {loadingAttendance ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <View className="flex-row items-baseline gap-1">
                <Text
                  className="text-[34px] font-display-bold leading-[38px]"
                  style={{ color: colors.text }}
                >
                  {attendedClass}
                </Text>
                <Text
                  className="text-lg font-sans mb-0.5"
                  style={{ color: colors.textSecondary }}
                >
                  / {totalClass}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-1 bg-surface rounded-2xl p-5 border border-border">
            <Text
              style={{ color: colors.textSecondary }}
              className="text-[10px] font-sans-md uppercase tracking-[1.5px] mb-2"
            >
              Status
            </Text>
            {loadingAttendance ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <View className="flex-row items-center gap-2 mt-1">
                <View
                  className="w-2.5 h-2.5 rounded-full mt-0.5"
                  style={{ backgroundColor: attendanceColor }}
                />
                <Text
                  className="font-display leading-7 text-[22px]"
                  style={{ color: attendanceColor }}
                >
                  {statusLabel}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

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
            <View
              className="rounded-full px-2.5 py-0.5 border"
              style={{ backgroundColor: colors.ctaSoft, borderColor: colors.border }}
            >
              <Text className="text-[11px] font-sans-md" style={{ color: colors.cta }}>
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
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center border-2 border-border"
                style={{ backgroundColor: colors.cta }}
              >
                <Text className="text-xl font-display" style={{ color: colors.onCta }}>
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
            <ActivityIndicator size="small" color={colors.cta} />
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
            <ActivityIndicator size="small" color={colors.cta} />
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
