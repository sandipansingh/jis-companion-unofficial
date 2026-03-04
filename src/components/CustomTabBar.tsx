import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  getTabColors,
  getTabIndicatorColor,
  getTabVisualConfig,
} from '@/src/constants/tabColors';
import { useTheme } from '@/src/contexts/ThemeContext';
import { BREAKPOINTS } from '@/src/hooks/useBreakpoint';
import { useDevice } from '@/src/hooks/useDevice';

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { isDark } = useTheme();
  const { isAndroid, isIOS, isWeb } = useDevice();
  const { width } = useWindowDimensions();

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { focusedColor, unfocusedColor } = getTabColors(isDark);
  const indicatorColor = getTabIndicatorColor(isDark);
  const tabVisuals = getTabVisualConfig({
    isDark,
    isAndroid,
    isIOS,
    variant: 'bottom',
  });

  const visibleRoutes = state.routes.filter(
    (route) => typeof descriptors[route.key]?.options?.tabBarIcon === 'function',
  );
  const routesToRender = visibleRoutes.length > 0 ? visibleRoutes : state.routes;
  const activeRouteKey = state.routes[state.index]?.key;
  const visibleIndex = routesToRender.findIndex((route) => route.key === activeRouteKey);
  const activeIndex = visibleIndex >= 0 ? visibleIndex : 0;
  const tabWidth = dimensions.width / routesToRender.length;
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 20,
      stiffness: 180,
    });
  }, [activeIndex, tabWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const isDesktopWeb = isWeb && width >= BREAKPOINTS.md;
  if (isDesktopWeb) return null;

  const onLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  return (
    <View
      className={
        isWeb
          ? 'absolute bottom-8 h-[65px] rounded-[35px] bg-transparent overflow-hidden self-center w-[92%] max-w-[560px]'
          : 'absolute bottom-8 left-0 right-0 h-[65px] rounded-[35px] bg-transparent overflow-hidden mx-[50px]'
      }
      style={{
        shadowColor: '#000',
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
        <View className="flex-row h-full items-center" onLayout={onLayout}>
          {dimensions.width > 0 && (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: tabWidth - 20,
                  height: dimensions.height - 20,
                  left: 10,
                  top: 10,
                  borderRadius: (dimensions.height - 20) / 2,
                  backgroundColor: indicatorColor,
                },
                animatedStyle,
              ]}
            />
          )}

          {routesToRender.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = activeIndex === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
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
                  color: isFocused ? focusedColor : unfocusedColor,
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
