import { useTheme } from "@/src/contexts/ThemeContext";
import { spacing } from "@/src/styles/commonStyles";
import { Star } from "lucide-react-native";
import React, { memo, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

function StarButton({
  num,
  value,
  onChange,
}: {
  num: number;
  value: number;
  onChange: (val: number) => void;
}) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start();

    onChange(num);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.starButton}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Star
          size={28}
          color={num <= value ? colors.amber : colors.gray300}
          fill={num <= value ? colors.amber : "transparent"}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

function StarRatingComponent({ value, onChange }: StarRatingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <StarButton key={num} num={num} value={value} onChange={onChange} />
        ))}
      </View>
    </View>
  );
}

export const StarRating = memo(StarRatingComponent);

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  starButton: {
    padding: 1,
  },
});
