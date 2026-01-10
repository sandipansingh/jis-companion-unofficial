import { useTheme } from "@/src/contexts/ThemeContext";
import { Pressable, StyleSheet, Text } from "react-native";

interface CreditsButtonProps {
  onPress: () => void;
}

export function CreditsButton({ onPress }: CreditsButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.creditsButton}>
      <Text style={[styles.creditsText, { color: colors.textSecondary }]}>
        Credits
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  creditsButton: {
    marginTop: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  creditsText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
