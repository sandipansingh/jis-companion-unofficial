import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

export interface DesktopHomeHeaderProps {
  userName: string;
  profileImageUrl?: string;
  courseName: string;
  collegeName: string;
  attendancePercentage: number;
  attendedClass: number;
  totalClass: number;
  loadingAttendance: boolean;
}

/**
 * DesktopHomeHeader
 *
 * Web-only replacement for WelcomeCard. Unlike WelcomeCard, which is a
 * full-width gradient banner that expands uncomfortably on large viewports,
 * this component renders:
 *
 *   - A horizontal name + avatar row (no gradient, surface-coloured cards)
 *   - A three-up stats strip: Attendance % | Classes | Status
 *
 * Props are identical to WelcomeCard so Home.web.tsx can pass the same
 * data without touching useHomeData().
 *
 * Rules:
 * - Only used in Home.web.tsx — never imported in mobile files.
 * - No business logic — pure layout and presentation.
 * - All styling via JSX style props (no NativeWind responsive classes).
 */
export function DesktopHomeHeader({
  userName,
  profileImageUrl,
  courseName,
  collegeName,
  attendancePercentage,
  attendedClass,
  totalClass,
  loadingAttendance,
}: DesktopHomeHeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const firstName = userName.split(' ')[0] || 'Student';

  const getInitials = (name: string): string => {
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
            <View className="rounded-full px-2.5 py-1 border border-cobalt-100 dark:border-cobalt-800/50 bg-cobalt-50 dark:bg-cobalt-900/30">
              <Text className="text-xs font-sans-md text-cobalt-600 dark:text-cobalt-300">
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
