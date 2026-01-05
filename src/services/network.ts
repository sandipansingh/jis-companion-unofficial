import * as Network from "expo-network";

export async function hasInternetConnection(): Promise<boolean> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return (
      networkState.isConnected === true &&
      networkState.isInternetReachable === true
    );
  } catch (error) {
    console.error("Error checking network state:", error);
    return false;
  }
}

export async function getNetworkState() {
  try {
    return await Network.getNetworkStateAsync();
  } catch (error) {
    console.error("Error getting network state:", error);
    return null;
  }
}

export async function waitForConnection(
  timeoutMs: number = 5000
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const isConnected = await hasInternetConnection();
    if (isConnected) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return false;
}
