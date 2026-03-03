import React from 'react';

import { SegmentedControl, SegmentedControlTab } from '@/src/components/SegmentedControl';
import type { FeesViewMode } from '@/src/features/settings/store/settingsStore';

interface FeesViewToggleProps {
  viewMode: FeesViewMode;
  onChangef: (mode: FeesViewMode) => void;
}

const TABS: SegmentedControlTab<FeesViewMode>[] = [
  { key: 'college', label: 'College View' },
  { key: 'simplified', label: 'Default Fees View' },
];

export function FeesViewToggle({ viewMode, onChangef }: FeesViewToggleProps) {
  return <SegmentedControl tabs={TABS} activeTab={viewMode} onTabChange={onChangef} />;
}
