import React from 'react';
import { Text, View } from 'react-native';

import { useAuthStore } from '@/src/features/auth/store';

export function DemoBanner() {
  const { isDemoAccount } = useAuthStore();

  if (!isDemoAccount) return null;

  if (__DEV__) return null; // Don't show in development mode

  return (
    <View
      className="absolute -right-[30px] z-[9999] w-[150px] rotate-45 top-[34px] shadow-md shadow-black/25"
      pointerEvents="none"
    >
      <View className="py-1.5 items-center justify-center rounded bg-red-600">
        <Text className="text-white font-bold text-[10px] uppercase">DEMO</Text>
      </View>
    </View>
  );
}
