import React from 'react';

import { useBreakpoint } from '@/src/hooks/useBreakpoint';

import { DesktopShell } from './DesktopShell';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

/** Renders DesktopShell on wide web, transparent pass-through on native/narrow web. */
export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const { isDesktopWeb } = useBreakpoint();

  if (isDesktopWeb) {
    return <DesktopShell>{children}</DesktopShell>;
  }

  // On native or narrow web: completely transparent wrapper — zero impact
  return <>{children}</>;
}
