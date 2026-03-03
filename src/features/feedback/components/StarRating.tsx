import { Star } from 'lucide-react-native';
import { memo, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

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
      Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    onChange(num);
  };

  const isFilled = num <= value;
  const emptyColor = colors.textTertiary;

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="p-0.5"
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Rate ${num} out of 10 stars`}
      accessibilityState={{ selected: isFilled }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Star
          size={28}
          color={isFilled ? colors.warning : emptyColor}
          fill={isFilled ? colors.warning : 'transparent'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

function StarRatingComponent({ value, onChange }: StarRatingProps) {
  return (
    <View className="py-1">
      <View className="flex-row justify-evenly items-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <StarButton key={num} num={num} value={value} onChange={onChange} />
        ))}
      </View>
    </View>
  );
}

export const StarRating = memo(StarRatingComponent);
