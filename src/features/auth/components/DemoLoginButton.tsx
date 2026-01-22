import { useTheme } from "@/src/contexts/ThemeContext";
import { Pressable, StyleSheet, Text } from "react-native";

interface DemoLoginButtonProps {
  onPress: () => void;
}

export function DemoLoginButton({ onPress }: DemoLoginButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.demoButton}>
      <Text style={[styles.demoText, { color: colors.textSecondary }]}>
        Want to test? Try demo login
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  demoButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  demoText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
