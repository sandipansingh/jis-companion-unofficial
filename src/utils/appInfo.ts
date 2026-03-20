import Constants from 'expo-constants';

import { device } from './device';

/**
 * Build the @p_vId value based on platform.
 * Android → "a_<version>", iOS → "i_<version>"
 */
export function getVersionId(): string {
  const currentVersion = Constants.expoConfig?.version || '1.0.0';
  const prefix = device.isIOS ? 'i' : 'a';
  return `${prefix}_${currentVersion}`;
}
