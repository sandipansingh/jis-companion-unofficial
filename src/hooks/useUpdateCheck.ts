import Constants from 'expo-constants';
import { useCallback, useEffect, useState } from 'react';

import { AppInfo, getAppInfo } from '@/src/api/appInfo';
import { device } from '@/src/utils/device';
import { getItemAsync, setItemAsync } from '@/src/utils/secureStore';
import { getUpdateType, UpdateType } from '@/src/utils/versionHelpers';

const UPDATE_CHECK_KEY = 'last_update_check';
const UPDATE_DISMISSED_KEY = 'update_dismissed_version';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface UpdateCheckResult {
  updateAvailable: boolean;
  updateType: UpdateType;
  appInfo: AppInfo | null;
  currentVersion: string;
  isChecking: boolean;
}

export function useUpdateCheck(): UpdateCheckResult {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateType, setUpdateType] = useState<UpdateType>('none');
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const currentVersion = Constants.expoConfig?.version || '1.0.0';

  const checkForUpdate = useCallback(async () => {
    try {
      setIsChecking(true);

      const now = Date.now();
      const lastCheck = await getItemAsync(UPDATE_CHECK_KEY);

      if (lastCheck) {
        const timeSinceLastCheck = now - parseInt(lastCheck, 10);
        if (timeSinceLastCheck < CHECK_INTERVAL) {
          setIsChecking(false);
          return;
        }
      }

      const latestAppInfo = await getAppInfo();
      await setItemAsync(UPDATE_CHECK_KEY, now.toString());

      const updateTypeResult = getUpdateType(currentVersion, latestAppInfo.version);

      if (updateTypeResult !== 'none') {
        const dismissedVersion = await getItemAsync(UPDATE_DISMISSED_KEY);

        if (updateTypeResult === 'major' || dismissedVersion !== latestAppInfo.version) {
          setUpdateAvailable(true);
          setUpdateType(updateTypeResult);
          setAppInfo(latestAppInfo);
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    } finally {
      setIsChecking(false);
    }
  }, [currentVersion]);

  useEffect(() => {
    if (!device.isAndroid) {
      return;
    }
    checkForUpdate();
  }, [checkForUpdate]);

  return {
    updateAvailable,
    updateType,
    appInfo,
    currentVersion,
    isChecking,
  };
}

/**
 * Mark the current update as dismissed
 * @param version - The version that was dismissed
 */
export const dismissUpdate = async (version: string): Promise<void> => {
  await setItemAsync(UPDATE_DISMISSED_KEY, version);
};
