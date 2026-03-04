import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  actionElement?: ReactNode;
  /**
   * Route to navigate to when there is no history to go back to
   * (e.g. after a hard-refresh on web). Falls back to '/(tabs)' if omitted.
   */
  fallbackRoute?: string;
}

export function Header({
  title,
  showBackButton = false,
  actionElement,
  fallbackRoute = '/(tabs)',
}: HeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute as any);
    }
  };

  if (isDesktopWeb) {
    return (
      <View className="flex-row items-center justify-between pt-7 pb-5 border-b border-border mb-7">
        <Text
          className="text-[22px] font-sans-bold text-text tracking-[-0.3px] leading-7 flex-1 mr-4"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <View className="flex-row items-center gap-3 flex-shrink-0">
          {actionElement && <View>{actionElement}</View>}
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBack}
              className="flex-row items-center gap-1.5 py-2 px-3 rounded-[10px] border border-border bg-surface"
              activeOpacity={0.7}
            >
              <ChevronLeft size={15} color={colors.textSecondary} />
              <Text
                style={{ color: colors.textSecondary }}
                className="text-[13px] font-sans-md"
              >
                Back
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      className="bg-surface dark:bg-surface pb-3.5 px-5"
      style={{
        paddingTop: Platform.select({ web: 20, default: 56 }),
      }}
    >
      {showBackButton ? (
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={handleBack}
            className="w-9 h-9 rounded-xl bg-ink-200 dark:bg-ink-800 items-center justify-center"
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text
            className="text-xl text-ink-900 dark:text-ink-100 flex-1 font-display"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {actionElement && <View>{actionElement}</View>}
        </View>
      ) : (
        <View className="flex-row items-center justify-between">
          <Text className="text-xl text-ink-900 dark:text-ink-100 font-display">
            {title}
          </Text>
          {actionElement && <View>{actionElement}</View>}
        </View>
      )}
    </View>
  );
}
