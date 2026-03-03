import { Tabs } from 'expo-router';
import { BookOpen, CreditCard, Home, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomTabBar from '@/src/components/CustomTabBar';
import { ResponsiveLayout } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { setInsets } = useSafeAreaStore();

  useEffect(() => {
    setInsets({
      bottom: insets.bottom,
      top: insets.top,
      left: insets.left,
      right: insets.right,
    });
  }, [insets.bottom, insets.top, insets.left, insets.right, setInsets]);

  return (
    <ResponsiveLayout>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: colors.base,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, color, size }) => (
              <Home size={size} color={color} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="academics"
          options={{
            title: 'Academics',
            tabBarIcon: ({ focused, color, size }) => (
              <BookOpen size={size} color={color} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="fees"
          options={{
            title: 'Fees',
            tabBarIcon: ({ focused, color, size }) => (
              <CreditCard size={size} color={color} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, color, size }) => (
              <User size={size} color={color} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
      </Tabs>
    </ResponsiveLayout>
  );
}
