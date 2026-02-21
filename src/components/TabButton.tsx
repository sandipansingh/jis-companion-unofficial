import { Text, TouchableOpacity } from "react-native";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function TabButton({ label, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      className={`flex-1 items-center justify-center rounded-xl py-2.5 min-h-[40px] ${
        isActive ? "bg-cobalt-500" : "bg-transparent"
      }`}
      style={
        isActive
          ? {
              shadowColor: "#2B5BDB",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 4,
            }
          : undefined
      }
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        className={`text-[11px] text-center tracking-widest uppercase font-sans-semi ${
          isActive ? "text-white" : "text-ink-500 dark:text-ink-400"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
