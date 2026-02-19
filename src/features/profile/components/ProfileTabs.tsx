import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

type TabType = "personal" | "guardian" | "bank" | "academic";

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: { key: TabType; label: string }[] = [
  { key: "personal", label: "PERSONAL" },
  { key: "guardian", label: "GUARDIAN" },
  { key: "bank", label: "BANK" },
  { key: "academic", label: "ACADEMIC" },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);

  const availableWidth = containerWidth;
  const tabWidth = availableWidth > 0 ? availableWidth / TABS.length : 0;

  useEffect(() => {
    if (tabWidth > 0) {
      const activeIndex = TABS.findIndex((tab) => tab.key === activeTab);
      if (activeIndex !== -1) {
          translateX.value = withSpring(activeIndex * tabWidth, {
            damping: 30,
            stiffness: 180,
          });
      }
    }
  }, [activeTab, tabWidth]); 

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      className="h-[55px] rounded-[35px] bg-transparent overflow-hidden w-full"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }}
      onLayout={onLayout}
    >
      <BlurView
        intensity={95}
        tint="default"
        className="flex-1 rounded-[35px] bg-white/55 dark:bg-black/55 border border-white/60 dark:border-white/10"
      >
        <View className="flex-1 flex-row items-center">
          {/* Animated Indicator Background */}
          {tabWidth > 0 && (
            <Animated.View
              className="absolute bg-slate-300 rounded-[25px] opacity-60"
              style={[
                {
                  width: tabWidth - 10,
                  left: 5,
                  height: "80%",
                  top: "10%",
                },
                animatedStyle,
              ]}
            />
          )}

          {/* Tab Buttons */}
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabChange(tab.key)}
                className="flex-1 justify-center items-center h-full z-10"
              >
                <Text
                  className={`text-[10px] sm:text-[11px] text-center tracking-widest uppercase font-semibold ${
                    isActive ? "text-[#1E2235]" : "text-[#64748B] dark:text-[#94A3B8]"
                  }`}
                  style={{ fontFamily: "GeneralSans-Semibold" }}
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
