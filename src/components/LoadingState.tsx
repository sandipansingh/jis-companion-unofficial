import { useTheme } from "@/src/contexts/ThemeContext";
import { commonStyles } from "@/src/styles/commonStyles";
import { ActivityIndicator } from "react-native";
import { Text, View } from "./Themed";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  const { colors } = useTheme();

  return (
    <View style={commonStyles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[commonStyles.loadingText, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}
