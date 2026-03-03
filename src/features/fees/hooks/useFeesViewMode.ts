/**
 * useFeesViewMode
 *
 * Reads and writes the fees view mode preference from the persisted settings store.
 * Provides a stable interface so the Fees screen doesn't import from settingsStore directly.
 */
import { useSettingsStore } from '@/src/features/settings/store/settingsStore';

export function useFeesViewMode() {
  const viewMode = useSettingsStore((s) => s.feesViewMode);
  const setViewMode = useSettingsStore((s) => s.setFeesViewMode);

  return { viewMode, setViewMode };
}
