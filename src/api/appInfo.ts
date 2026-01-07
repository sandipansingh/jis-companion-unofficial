import { unofficialApiClient } from "./client";

export interface AppInfo {
  platform: string;
  appId: string;
  title: string;
  description: string;
  version: string;
  updated: number;
  releaseNotes: string;
  url: string;
  icon: string;
  headerImage: string;
  screenshots: string[];
  installs: string;
  minInstalls: number;
  maxInstalls: number;
  price: number;
  free: boolean;
  currency: string;
  priceText: string;
  developer: {
    name: string;
    email: string;
  };
  genre: string;
  genreId: string;
  contentRating: string;
  adSupported: boolean;
  androidVersion: string;
  androidVersionText: string;
}

export interface AppInfoResponse {
  success: boolean;
  message: string;
  data: {
    android: AppInfo;
  };
}

/**
 * Fetches app information including latest version from unofficial API
 */
export const getAppInfo = async (): Promise<AppInfo> => {
  const response = await unofficialApiClient.get<AppInfoResponse>(
    "/app-info"
  );
  return response.data.data.android;
};
