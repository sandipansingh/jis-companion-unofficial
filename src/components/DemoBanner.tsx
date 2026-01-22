import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuthStore } from "@/src/features/auth/store";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function DemoBanner() {
  const { isDemoAccount } = useAuthStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!isDemoAccount) return null;

  return (
    <View style={[styles.container, { top: 34 }]}>
      <View style={[styles.banner, { backgroundColor: colors.error }]}>
        <Text style={styles.text}>DEMO</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: -30,
    zIndex: 9999,
    width: 150,
    transform: [{ rotate: "45deg" }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    pointerEvents: "none", // Allow clicking through
  },
  banner: {
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
    textTransform: "uppercase",
  },
});
