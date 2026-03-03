import React from 'react';
import { View } from 'react-native';

import { DesktopSidebar } from './DesktopSidebar';

interface DesktopShellProps {
  children: React.ReactNode;
}

/** Full-height two-column layout (sidebar + content) for desktop web. */
export function DesktopShell({ children }: DesktopShellProps) {
  return (
    <View className="flex-1 flex-row bg-base web:min-h-screen">
      <DesktopSidebar />

      <View className="flex-1 overflow-hidden bg-base">{children}</View>
    </View>
  );
}
