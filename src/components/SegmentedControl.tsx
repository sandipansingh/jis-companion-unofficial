import { useEffect, useRef, useState } from 'react';
import { Animated, LayoutRectangle, Platform, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

export interface SegmentedControlTab<T extends string> {
  key: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  tabs: SegmentedControlTab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export function SegmentedControl<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: SegmentedControlProps<T>) {
  const { colors, isDark } = useTheme();

  const activeIndex = tabs.findIndex((t) => t.key === activeTab);
  const [layouts, setLayouts] = useState<(LayoutRectangle | null)[]>(() =>
    tabs.map(() => null),
  );

  const translateX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    const layout = layouts[activeIndex];
    if (!layout) return;

    const toX = layout.x;
    const toW = layout.width;

    if (isFirstRender.current) {
      translateX.setValue(toX);
      indicatorWidth.setValue(toW);
      isFirstRender.current = false;
      return;
    }

    Animated.parallel([
      Animated.spring(translateX, {
        toValue: toX,
        useNativeDriver: false,
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      }),
      Animated.spring(indicatorWidth, {
        toValue: toW,
        useNativeDriver: false,
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      }),
    ]).start();
  }, [activeIndex, layouts, indicatorWidth, translateX]);

  return (
    <View
      className="flex-row rounded-xl p-1 self-stretch"
      style={{ backgroundColor: isDark ? colors.elevated : colors.overlay }}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          width: indicatorWidth,
          transform: [{ translateX }],
          borderRadius: 9,
          backgroundColor: colors.surface,
          ...(Platform.OS === 'web'
            ? { boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }
            : {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.25 : 0.12,
                shadowRadius: 2,
                elevation: 2,
              }),
        }}
      />

      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onLayout={(e) => {
              const layout = e.nativeEvent.layout;
              setLayouts((prev) => {
                const next = [...prev];
                next[index] = layout;
                return next;
              });
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
              paddingVertical: 7,
              overflow: 'hidden',
              ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
            }}
          >
            <Text
              numberOfLines={1}
              className="text-[13px] font-sans"
              style={{
                color: isActive ? colors.text : colors.textTertiary,
                fontWeight: isActive ? '600' : '400',
                flexShrink: 1,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
