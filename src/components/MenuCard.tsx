import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';
import { withAlpha } from '../utils/colorHelpers';

interface MenuCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  onPress: () => void;
  disabled?: boolean;
}

export function MenuCard({
  title,
  description,
  icon: Icon,
  iconColor,
  onPress,
  disabled = false,
}: MenuCardProps) {
  const { colors } = useTheme();
  const chevronColor = colors.textTertiary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      disabled={disabled}
      className={`flex-row items-center bg-surface dark:bg-surface rounded-2xl p-5 mb-3 border border-border ${disabled ? 'opacity-40' : ''}`}
      style={{
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
        style={{ backgroundColor: withAlpha(iconColor, 0.09) }}
      >
        <Icon size={24} color={iconColor} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-base text-ink-900 dark:text-white font-sans-semi">
          {title}
        </Text>
        <Text className="text-sm text-ink-600 dark:text-ink-400 font-sans">
          {description}
        </Text>
      </View>
      <ChevronRight size={18} color={chevronColor} />
    </TouchableOpacity>
  );
}
