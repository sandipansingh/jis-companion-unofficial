import * as Crypto from 'expo-crypto';

import * as SecureStore from '@/src/utils/secureStore';

/**
 * Get or create a persistent installation ID (p_iId) stored in SecureStore.
 */
export async function getOrCreateInstallId(): Promise<string> {
  let installId = await SecureStore.getItemAsync('install_id');
  if (!installId) {
    const bytes = Crypto.getRandomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    installId = [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ]
      .join('-')
      .toUpperCase();
    await SecureStore.setItemAsync('install_id', installId);
  }
  return installId;
}
