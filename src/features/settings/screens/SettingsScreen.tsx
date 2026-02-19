import { Header } from "@/src/components";
import { useRouter } from "expo-router";
import { Moon, Sun } from "lucide-react-native";
import { ScrollView, Switch, Text, View } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View className="flex-1 bg-base dark:bg-base">
      {/* Header */}
      <Header title="Settings" showBackButton/>

      <ScrollView contentContainerClassName="p-4">
        
        {/* Appearance Section */}
        <View className="mb-6">
          <Text className="text-xs font-medium mb-2 ml-1 tracking-wider text-ink-500 dark:text-ink-400 font-sans">APPEARANCE</Text>
          
          <View className="bg-white dark:bg-ink-900 rounded-2xl overflow-hidden p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-9 h-9 rounded-[10px] justify-center items-center mr-3 ${isDark ? "bg-cobalt-900" : "bg-cobalt-50"}`}>
                  {isDark ? (
                    <Moon size={20} color={colors.primary} />
                  ) : (
                    <Sun size={20} color={colors.primary} />
                  )}
                </View>
                <Text className="text-base font-medium text-ink-950 dark:text-ink-100 font-sans">Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={() => {
                  toggleTheme();
                }}
                trackColor={{ false: colors.ink === undefined ? "#E2E8F0" : colors.ink[300], true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
            <Text className="text-xs text-ink-500 dark:text-ink-400 mt-2 font-sans italic">
              Note: Dark mode is currently in beta. For the best experience, we recommend using light mode.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
