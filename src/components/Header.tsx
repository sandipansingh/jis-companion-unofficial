import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ReactNode } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  actionElement?: ReactNode;
}

export function Header({
  title,
  showBackButton = false,
  actionElement,
}: HeaderProps) {
  const router = useRouter();
  const { isDark, colors } = useTheme();

  return (
    <View
      className="bg-surface dark:bg-surface"
      style={{
        paddingTop: Platform.select({ web: 20, default: 56 }),
        paddingBottom: 14,
        paddingHorizontal: 20,
        backgroundColor: colors.surface,
      }}
    >
      {showBackButton ? (
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-xl bg-ink-200 dark:bg-ink-800 items-center justify-center"
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={isDark ? "#F8FAFC" : "#1E2235"} />
          </TouchableOpacity>
          <Text
            className="text-xl text-ink-900 dark:text-ink-100 flex-1 font-display"
          >
            {title}
          </Text>
          {actionElement && <View>{actionElement}</View>}
        </View>
      ) : (
        <View className="flex-row items-center justify-between">
          <Text
            className="text-xl text-ink-900 dark:text-ink-100 font-display"
          >
            {title}
          </Text>
          {actionElement && <View>{actionElement}</View>}
        </View>
      )}
    </View>
  );
}
