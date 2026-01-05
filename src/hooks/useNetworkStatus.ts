import { useEffect, useState } from "react";
import { hasInternetConnection } from "../services/network";

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

/**
 * React hook that exposes an offline-friendly network status object.
 *
 * @returns {{ isOnline: boolean; fromCache: boolean; isChecking: boolean }}
 * - `isOnline`: last known connectivity
 * - `fromCache`: reserved for callers that mark cached data (this hook currently keeps it false)
 * - `isChecking`: true during initial check
 */
export function useOfflineStatus() {
  const [status, setStatus] = useState<{
    isOnline: boolean;
    fromCache: boolean;
    isChecking: boolean;
  }>({
    isOnline: true,
    fromCache: false,
    isChecking: true,
  });

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      if (!mounted) return;

      const online = await hasInternetConnection();

      if (mounted) {
        setStatus((prev) => ({
          ...prev,
          isOnline: online,
          isChecking: false,
        }));
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return status;
}
