import { getTabIndicatorColor, getTabLabelColor, getTabVisualConfig } from "@/src/constants/tabColors";
import { useTheme } from "@/src/contexts/ThemeContext";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Platform, Pressable, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

export interface SegmentedControlTab<T extends string> {
  key: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  tabs: SegmentedControlTab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export function SegmentedControl<T extends string>({ tabs, activeTab, onTabChange }: SegmentedControlProps<T>) {
  const { isDark } = useTheme();
  const isAndroid = Platform.OS === "android";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const [containerSize, setContainerSize] = useState({ width: 0, height: 55 });
  const translateX = useSharedValue(0);
  const indicatorColor = getTabIndicatorColor(isDark);
  const tabVisuals = getTabVisualConfig({
    isDark,
    isAndroid,
    isIOS,
    variant: "segmented",
  });

  const availableWidth = containerSize.width;
  const tabWidth = availableWidth > 0 ? availableWidth / tabs.length : 0;
  const indicatorInset = isWeb ? 8 : 5;
  const indicatorVerticalInset = isWeb ? 7 : 5;
  const indicatorHeight = Math.max(0, containerSize.height - indicatorVerticalInset * 2);

  useEffect(() => {
    if (tabWidth > 0) {
      const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);
      if (activeIndex !== -1) {
          translateX.value = withSpring(activeIndex * tabWidth, {
            damping: 20,
            stiffness: 180,
          });
      }
    }
  }, [activeTab, tabWidth, tabs]); 

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerSize({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  return (
    <View
      className={`h-[55px] rounded-[35px] bg-transparent overflow-hidden w-full ${
        isWeb ? "max-w-[560px] self-center" : ""
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: tabVisuals.shadowOpacity,
        shadowRadius: 12,
        elevation: tabVisuals.elevation,
      }}
    >
      <BlurView
        intensity={tabVisuals.blurIntensity}
        tint={tabVisuals.tint}
        className="flex-1 rounded-[35px]"
        style={{
          backgroundColor: tabVisuals.backgroundColor,
          borderWidth: tabVisuals.borderWidth,
          borderColor: tabVisuals.borderColor,
        }}
      >
        <View className="flex-1 flex-row items-center" onLayout={onLayout}>
          {/* Animated Indicator Background */}
          {tabWidth > 0 && (
            <Animated.View
              className="absolute"
              style={[
                {
                  position: "absolute",
                  width: tabWidth - indicatorInset * 2,
                  left: indicatorInset,
                  height: indicatorHeight,
                  top: indicatorVerticalInset,
                  borderRadius: indicatorHeight / 2,
                  backgroundColor: indicatorColor,
                },
                animatedStyle,
              ]}
            />
          )}

          {/* Tab Buttons */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabChange(tab.key)}
                className="flex-1 justify-center items-center h-full z-10"
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  className="text-[10px] sm:text-[11px] text-center tracking-widest uppercase font-sans-semi"
                  style={{ color: getTabLabelColor(isDark, isActive) }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}
