import { Pressable, Text, View } from "react-native";

interface DemoLoginButtonProps {
  onPress: () => void;
}

export function DemoLoginButton({ onPress }: DemoLoginButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-5 py-3 items-center"
    >
      <View className="flex-row items-center gap-2">
        <View className="h-px w-8 bg-ink-300" />
        <Text
          className="text-sm text-ink-500"
          style={{ fontFamily: "GeneralSans-Regular" }}
        >
          or try demo login
        </Text>
        <View className="h-px w-8 bg-ink-300" />
      </View>
    </Pressable>
  );
}
