import Constants from 'expo-constants';

import { device } from '@/src/utils/device';

/**
 * Build the @p_vId value based on platform.
 * Android → "a_<version>", iOS → "i_<version>"
 */
export function getVersionId(): string {
  const prefix = device.isAndroid ? 'a' : device.isIOS ? 'i' : 'u';
  const version = Constants.expoConfig?.version || '1.0.0';
  return `${prefix}_${version}`;
}
