import { useTheme } from "@/src/contexts/ThemeContext";
import { commonStyles } from "@/src/styles/commonStyles";
import React from "react";
import { Button } from "./Button";
import { Text, View } from "./Themed";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({
  message,
  onRetry,
  retryText = "Retry",
}: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View style={commonStyles.centerContainer}>
      <Text style={[commonStyles.errorText, { color: colors.error }]}>
        {message}
      </Text>
      {onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          fullWidth={false}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            height: "auto",
          }}
          textStyle={{
            fontSize: 14,
          }}
        />
      )}
    </View>
  );
}
