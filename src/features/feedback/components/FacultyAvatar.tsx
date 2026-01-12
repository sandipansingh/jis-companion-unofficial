import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface FacultyAvatarProps {
  imageUrl?: string;
  name: string;
  size?: number;
}

export function FacultyAvatar({
  imageUrl,
  name,
  size = 48,
}: FacultyAvatarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
        },
      ]}
    >
      {imageUrl ? (
        <Image
          source={{
            uri: `https://jisgroup.net/hr/UploadFile/${imageUrl}`,
          }}
          style={styles.image}
        />
      ) : (
        <View style={styles.fallback}>
          <Text
            style={[
              styles.fallbackText,
              {
                fontSize: size > 60 ? 32 : 18,
                color: colors.textMuted,
              },
            ]}
          >
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontWeight: "bold",
  },
});
