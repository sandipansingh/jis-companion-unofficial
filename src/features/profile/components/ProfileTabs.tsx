import React from 'react';

import { SegmentedControl, SegmentedControlTab } from '@/src/components/SegmentedControl';

type TabType = 'personal' | 'guardian' | 'bank' | 'academic';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: SegmentedControlTab<TabType>[] = [
  { key: 'personal', label: 'PERSONAL' },
  { key: 'guardian', label: 'GUARDIAN' },
  { key: 'bank', label: 'BANK' },
  { key: 'academic', label: 'ACADEMIC' },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return <SegmentedControl tabs={TABS} activeTab={activeTab} onTabChange={onTabChange} />;
}
