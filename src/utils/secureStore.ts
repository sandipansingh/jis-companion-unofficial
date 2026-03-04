import * as SecureStore from 'expo-secure-store';

import { device } from '@/src/hooks/useDevice';

const isWeb = device.isWeb;
const sensitiveKeywords = ['_password'];

/**
 * Persist a key–value pair securely across platforms.
 *
 * Platform behavior:
 * - Sensitive keys (containing keywords like "_password")
 *   are skipped on Web (localStorage is not considered secure).
 * - Native (iOS / Android): Uses Expo SecureStore for encrypted storage (including sensitive).
 * - Web: Uses localStorage for non-sensitive data.
 *
 * @param {string} key
 * @param {string} value
 */
export async function setItemAsync(key: string, value: string): Promise<void> {
  const isSensitive = sensitiveKeywords.some((keyword) =>
    key.toLowerCase().includes(keyword),
  );

  // If running on web and this key is sensitive, skip storing.
  if (isSensitive && isWeb) {
    return;
  }

  if (isWeb) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Local storage is not available:', e);
    }
  } else {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.error('SecureStore.setItemAsync failed:', e);
    }
  }
}

/**
 * Retrieve a stored value by key across platforms.
 *
 * - Sensitive keys return null on web.
 * - On native, sensitive keys are retrievable from SecureStore.
 *
 * @param {string} key
 * @returns {Promise<string | null>}
 */
export async function getItemAsync(key: string): Promise<string | null> {
  const isSensitive = sensitiveKeywords.some((keyword) =>
    key.toLowerCase().includes(keyword),
  );

  // If running on web and this key is sensitive, don't attempt to read it.
  if (isSensitive && isWeb) {
    return null;
  }

  if (isWeb) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Local storage is not available:', e);
      return null;
    }
  } else {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.error('SecureStore.getItemAsync failed:', e);
      return null;
    }
  }
}

/**
 * Remove a stored key–value pair across platforms.
 *
 * - Sensitive keys are skipped on web (they weren't stored there).
 * - On native, sensitive keys will be deleted from SecureStore.
 *
 * @param {string} key
 */
export async function deleteItemAsync(key: string): Promise<void> {
  const isSensitive = sensitiveKeywords.some((keyword) =>
    key.toLowerCase().includes(keyword),
  );

  // If running on web and this key is sensitive, nothing to delete.
  if (isSensitive && isWeb) {
    return;
  }

  if (isWeb) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Local storage is not available:', e);
    }
  } else {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.error('SecureStore.deleteItemAsync failed:', e);
    }
  }
}
