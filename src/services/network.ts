import * as Network from 'expo-network';

export async function hasInternetConnection(): Promise<boolean> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected === true && networkState.isInternetReachable === true;
  } catch (error) {
    console.error('Error checking network state:', error);
    return false;
  }
}
