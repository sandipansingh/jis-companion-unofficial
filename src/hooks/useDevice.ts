import type { DeviceInfo } from '@/src/utils/device';
import { device } from '@/src/utils/device';

export type { DeviceInfo };

/**
 * Hook for accessing device platform info inside React components.
 * For module-level (non-component) code, import `device` from `@/src/utils/device`.
 */
export function useDevice(): DeviceInfo {
  return device;
}
