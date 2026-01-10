import { useTheme } from "@/src/contexts/ThemeContext";
import { commonStyles } from "@/src/styles/commonStyles";
import { TouchableOpacity } from "react-native";
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
        <TouchableOpacity
          style={[
            commonStyles.retryButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={onRetry}
        >
          <Text style={commonStyles.retryButtonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
