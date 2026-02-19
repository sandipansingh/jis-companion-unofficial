import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const tabWidth = dimensions.width / state.routes.length;
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 20,
      stiffness: 180,
    });
  }, [state.index, tabWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  return (
    <View
      className="absolute bottom-8 left-0 right-0 h-[65px] rounded-[35px] bg-transparent overflow-hidden mx-[50px]"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <BlurView
        intensity={100}
        tint="default"
        className="flex-1 rounded-[35px] bg-white/65 dark:bg-black/65 border border-white/60 dark:border-white/10"
      >
        <View
          className="flex-row h-full items-center"
          onLayout={onLayout}
        >
          {dimensions.width > 0 && (
            <Animated.View
              className="absolute bg-slate-300 rounded-[25px] opacity-60"
              style={[
                {
                  width: tabWidth - 20,
                  height: dimensions.height - 20,
                  left: 10,
                },
                animatedStyle,
              ]}
            />
          )}

          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                className="flex-1 justify-center items-center h-full"
              >
                {options.tabBarIcon?.({
                  focused: isFocused,
                  color: isFocused ? "#1E2235" : "#64748B",
                  size: 24,
                })}
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}
