import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

interface WeekNavigatorProps {
  weekPeriod: string;
  onPrevious: () => void;
  onNext: () => void;
}

export function WeekNavigator({
  weekPeriod,
  onPrevious,
  onNext,
}: WeekNavigatorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.weekNavigation}>
      <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
        <ChevronLeft size={32} color={colors.text} />
      </TouchableOpacity>

      <Text style={[styles.weekRange, { color: colors.textSecondary }]}>
        {weekPeriod}
      </Text>

      <TouchableOpacity onPress={onNext} style={styles.navButton}>
        <ChevronRight size={32} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "transparent",
  },
  navButton: {
    padding: 4,
  },
  weekRange: {
    fontSize: 15,
    fontWeight: "600",
  },
});
