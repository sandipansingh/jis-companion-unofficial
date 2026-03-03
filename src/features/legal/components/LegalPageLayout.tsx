import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

interface LegalPageLayoutProps {
  children: ReactNode;
}

export function LegalPageLayout({ children }: LegalPageLayoutProps) {
  return (
    <View className="flex-1 bg-base">
      <ScrollView className="flex-1" contentContainerClassName="px-5 py-6">
        <View className="w-full max-w-3xl self-center gap-5">{children}</View>
      </ScrollView>
    </View>
  );
}
