import { useEffect, useState } from 'react';

import { hasInternetConnection } from '../services/network';

/**
 * React hook that periodically checks whether the device has internet connectivity.
 *
 * Polling:
 * - Checks immediately on mount.
 * - Re-checks every 30 seconds.
 *
 * @returns {{ isOnline: boolean; isChecking: boolean }}
 * `isOnline` indicates last known connectivity; `isChecking` is true during an active check.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      if (!mounted) return;

      setIsChecking(true);
      const online = await hasInternetConnection();

      if (mounted) {
        setIsOnline(online);
        setIsChecking(false);
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isOnline, isChecking };
}
