import React from 'react';

import { SegmentedControl, SegmentedControlTab } from '@/src/components/SegmentedControl';

type TabType = 'my-qr' | 'scanned';

interface ConnectTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: SegmentedControlTab<TabType>[] = [
  { key: 'my-qr', label: 'MY QR' },
  { key: 'scanned', label: 'SCANNED' },
];

export function ConnectTabs({ activeTab, onTabChange }: ConnectTabsProps) {
  return <SegmentedControl tabs={TABS} activeTab={activeTab} onTabChange={onTabChange} />;
}
