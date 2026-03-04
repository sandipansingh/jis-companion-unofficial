import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { withAlpha } from '../utils/colorHelpers';

export type MenuCardVariant = 'default' | 'compact' | 'large';

interface MenuCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: MenuCardVariant;
  showIcon?: boolean;
  showArrow?: boolean;
  cardClassName?: string;
}

export function MenuCard({
  title,
  description,
  icon: Icon,
  iconColor,
  onPress,
  disabled = false,
  variant = 'default',
  showIcon = true,
  showArrow = true,
  cardClassName,
}: MenuCardProps) {
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const chevronColor = colors.textTertiary;

  const iconSize = variant === 'compact' ? 20 : variant === 'large' ? 28 : 24;
  const iconContainerClass =
    variant === 'compact'
      ? 'w-10 h-10 rounded-xl'
      : variant === 'large'
        ? 'w-14 h-14 rounded-2xl'
        : 'w-12 h-12 rounded-2xl';

  const paddingClass =
    variant === 'compact'
      ? 'p-4'
      : variant === 'large'
        ? isDesktopWeb
          ? 'p-6'
          : 'p-5'
        : isDesktopWeb
          ? 'p-[18px]'
          : 'p-5';

  const titleClass =
    variant === 'compact'
      ? 'text-[13px]'
      : variant === 'large'
        ? 'text-[17px]'
        : 'text-base';

  const descClass = variant === 'compact' ? 'text-xs' : 'text-sm';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={[
        'flex-row items-center bg-surface dark:bg-surface rounded-2xl mb-3 border border-border',
        'web:hover:bg-overlay dark:web:hover:bg-elevated web:cursor-pointer web:transition-colors web:duration-150',
        paddingClass,
        disabled ? 'opacity-40' : '',
        cardClassName ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={({ pressed }: any) => ({
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        ...(pressed ? { backgroundColor: colors.overlay } : {}),
      })}
    >
      {showIcon && (
        <View
          className={`${iconContainerClass} items-center justify-center mr-4`}
          style={{ backgroundColor: withAlpha(iconColor, 0.09) }}
        >
          <Icon size={iconSize} color={iconColor} />
        </View>
      )}
      <View className="flex-1 gap-0.5">
        <Text className={`${titleClass} text-ink-900 dark:text-white font-sans-semi`}>
          {title}
        </Text>
        <Text className={`${descClass} text-ink-600 dark:text-ink-400 font-sans`}>
          {description}
        </Text>
      </View>
      {showArrow && <ChevronRight size={18} color={chevronColor} />}
    </Pressable>
  );
}
