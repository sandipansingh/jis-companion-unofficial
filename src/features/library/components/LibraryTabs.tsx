import React from 'react';

import { SegmentedControl, SegmentedControlTab } from '@/src/components/SegmentedControl';

type FilterType = '1' | '2';

interface LibraryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS: SegmentedControlTab<FilterType>[] = [
  { key: '1', label: 'ALL BOOKS' },
  { key: '2', label: 'TO RETURN' },
];

export function LibraryTabs({ activeTab, onTabChange }: LibraryTabsProps) {
  return (
    <SegmentedControl
      tabs={TABS}
      activeTab={activeTab as FilterType}
      onTabChange={onTabChange}
    />
  );
}
