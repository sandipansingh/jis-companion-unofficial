import React from "react";
import { Text, View } from "react-native";
import { Button } from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({
  message,
  onRetry,
  retryText = "Try again",
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-5 bg-base px-8">
      <View className="w-20 h-20 rounded-3xl bg-danger-light items-center justify-center">
        <Text className="text-3xl">⚠️</Text>
      </View>
      <Text
        className="text-base text-ink-700 text-center leading-6 font-sans"
      >
        {message}
      </Text>
      {onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          variant="secondary"
          fullWidth={false}
          size="sm"
        />
      )}
    </View>
  );
}
