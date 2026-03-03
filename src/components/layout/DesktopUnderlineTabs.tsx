import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export interface DesktopTabItem<T extends string = string> {
  key: T;
  label: string;
}

interface DesktopUnderlineTabsProps<T extends string> {
  tabs: DesktopTabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  /** Optional gap between the bottom of the tab row and the content below. Default 0. */
  marginBottom?: number;
}

/** Horizontal tab navigation with an underline indicator for desktop screens. */
export function DesktopUnderlineTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  marginBottom = 0,
}: DesktopUnderlineTabsProps<T>) {
  // const { colors } = useTheme();

  return (
    <View
      className="border-b border-border"
      style={{
        marginBottom,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-1 px-1 pb-2 pt-1"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-colors duration-150 active:opacity-70 ${
                isActive
                  ? 'bg-slate-400/30 dark:bg-white/[0.12]'
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Text
                className={`text-[13px] tracking-[0.3px] uppercase ${
                  isActive
                    ? 'font-sans-semi text-[#1E2235] dark:text-[#E2E8F0]'
                    : 'font-sans-md text-ink-700 dark:text-ink-400'
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
