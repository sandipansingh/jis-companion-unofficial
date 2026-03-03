import React from 'react';
import { View, type ViewProps } from 'react-native';

import { useBreakpoint } from '@/src/hooks/useBreakpoint';

interface ContentContainerProps extends ViewProps {
  children: React.ReactNode;
  /**
   * Maximum width for the content area on large screens.
   * Defaults to 1280 (xl breakpoint).
   */
  maxWidth?: number;
  /**
   * When true the container centres itself horizontally.
   * Defaults to true on desktop, no-op on mobile.
   */
  centered?: boolean;
}

/**
 * Constrains content width on wide desktop viewports. Transparent pass-through on mobile.
 */
export function ContentContainer({
  children,
  maxWidth = 1280,
  centered = true,
  style,
  ...rest
}: ContentContainerProps) {
  const { isDesktopWeb } = useBreakpoint();

  if (!isDesktopWeb) {
    // On native and narrow web, render as a transparent no-op container
    return (
      <View style={[{ flex: 1 }, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        {
          flex: 1,
          width: '100%',
          maxWidth,
          ...(centered ? { alignSelf: 'center' as const } : {}),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
