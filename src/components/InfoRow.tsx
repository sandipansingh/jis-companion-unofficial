import React from "react";
import { Text, useColorScheme, View } from "react-native";

interface InfoRowProps {
  label: string;
  value: string | undefined;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  isLast?: boolean;
}

export function InfoRow({ label, value, icon: Icon, isLast = false }: InfoRowProps) {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#93C5FD" : "#2B5BDB";

  return (
    <View className={`py-3 ${!isLast ? "border-b border-border" : ""}`}>
      <Text
        className="text-[10px] text-ink-600 dark:text-ink-400 uppercase tracking-widest mb-2 font-sans-semi"
      >
        {label}
      </Text>
      <View className="flex-row items-center gap-3">
        <Icon size={16} color={iconColor} />
        <Text
          className={`text-sm flex-1 font-sans ${
            value ? "text-ink-900 dark:text-white" : "text-ink-500 dark:text-ink-500 italic"
          }`}
        >
          {value || "Not provided"}
        </Text>
      </View>
    </View>
  );
}
