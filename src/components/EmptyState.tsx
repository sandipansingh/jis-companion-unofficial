import { useTheme } from "@/src/contexts/ThemeContext";
import { commonStyles } from "@/src/styles/commonStyles";
import { Text, View } from "./Themed";

interface EmptyStateProps {
  message: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}

export function EmptyState({ message, icon: Icon }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={commonStyles.centerContainer}>
      {Icon && <Icon size={48} color={colors.textSecondary} />}
      <Text style={[commonStyles.emptyText, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}
