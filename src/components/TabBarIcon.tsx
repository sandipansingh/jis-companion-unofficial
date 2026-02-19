import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
  icon: React.FC<{ size: number; color: string; strokeWidth?: number }>;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  focused,
  color,
  size,
  icon: Icon,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View className="items-center justify-center w-[60px] h-10">
      {/* Active Indicator Background */}
      <Animated.View
        className="absolute w-[50px] h-[50px] rounded-[25px] bg-slate-100"
        style={useAnimatedStyle(() => ({
          transform: [{ scale: withSpring(focused ? 1 : 0) }],
          opacity: withTiming(focused ? 1 : 0),
        }))}
      />

      {/* Icon */}
      <View className="z-10">
        <Icon
          size={24}
          color={focused ? "#1E2235" : "#64748B"}
          strokeWidth={focused ? 2 : 1.5}
        />
      </View>
    </View>
  );
};
