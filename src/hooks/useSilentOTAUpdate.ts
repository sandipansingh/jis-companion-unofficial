import * as Updates from 'expo-updates';
import { useEffect } from 'react';

import { device } from '@/src/utils/device';

/**
 * Silent OTA Update Hook
 *
 * Checks for and downloads OTA updates in the background without interrupting the user.
 * The update will be applied automatically on the next app restart.
 */
export function useSilentOTAUpdate() {
  useEffect(() => {
    async function checkAndDownloadUpdate() {
      if (__DEV__ || device.isWeb || !Updates.isEnabled) {
        return;
      }

      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
        }
      } catch (error) {
        console.error('[OTA] Silent update check failed:', error);
      }
    }

    checkAndDownloadUpdate();
  }, []);
}
