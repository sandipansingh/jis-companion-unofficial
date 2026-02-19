import { ActivityIndicator, Text, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-base">
      <ActivityIndicator size="large" color="#2B5BDB" />
      <Text
        className="text-sm text-ink-600 tracking-wide"
        style={{ fontFamily: "GeneralSans-Regular" }}
      >
        {message}
      </Text>
    </View>
  );
}
