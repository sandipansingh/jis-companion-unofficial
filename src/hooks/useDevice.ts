import { Platform } from 'react-native';

export interface DeviceInfo {
  isAndroid: boolean;
  isIOS: boolean;
  isWeb: boolean;
}

export const device: DeviceInfo = {
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  isWeb: Platform.OS === 'web',
};

export function useDevice(): DeviceInfo {
  return device;
}
