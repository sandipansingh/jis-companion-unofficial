import { useAuthStore } from "@/src/features/auth/store";
import React from "react";
import { Text, View } from "react-native";

export function DemoBanner() {
  const { isDemoAccount } = useAuthStore();

  if (!isDemoAccount) return null;

  if (__DEV__) return null; // Don't show in development mode

  return (
    <View
      className="absolute -right-[30px] z-[9999] w-[150px] rotate-45 top-[34px]"
      pointerEvents="none"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View className="py-1.5 items-center justify-center rounded bg-red-600">
        <Text className="text-white font-bold text-[10px] uppercase">DEMO</Text>
      </View>
    </View>
  );
}
