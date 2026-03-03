import { Check, Clock, X } from 'lucide-react-native';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface AttendanceStatusCardProps {
  status: string;
  style?: StyleProp<ViewStyle>;
}

export function AttendanceStatusCard({ status, style }: AttendanceStatusCardProps) {
  const { colors } = useTheme();
  const isPresent = status.toLowerCase() === 'present';
  const isNotYetAvailable = status.toLowerCase() === 'not yet available';

  const config = isPresent
    ? {
        bg: colors.successBg,
        iconBg: colors.successStrong,
        text: colors.successText,
        subtext: colors.success,
        message: 'You attended this class',
        icon: <Check size={22} color="white" />,
      }
    : isNotYetAvailable
      ? {
          bg: colors.elevated,
          iconBg: colors.textTertiary,
          text: colors.text,
          subtext: colors.textTertiary,
          message: '',
          icon: <Clock size={22} color="white" />,
        }
      : {
          bg: colors.dangerBg,
          iconBg: colors.dangerStrong,
          text: colors.dangerText,
          subtext: colors.danger,
          message: 'You missed this class',
          icon: <X size={22} color="white" />,
        };

  return (
    <View
      className="bg-surface dark:bg-surface rounded-2xl border border-border p-4 mb-4"
      style={[
        {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        },
        style,
      ]}
    >
      <Text className="text-[10px] text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-2.5 font-sans-semi">
        Attendance Status
      </Text>
      <View
        className="flex-row items-center justify-between rounded-xl p-3"
        style={{ backgroundColor: config.bg }}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: config.iconBg }}
          >
            {config.icon}
          </View>
          <View>
            <Text className="text-lg font-display" style={{ color: config.text }}>
              {status}
            </Text>
            {config.message !== '' && (
              <Text className="text-sm font-sans" style={{ color: config.subtext }}>
                {config.message}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
