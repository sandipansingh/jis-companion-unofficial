import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * Silent OTA Update Hook
 *
 * Checks for and downloads OTA updates in the background without interrupting the user.
 * The update will be applied automatically on the next app restart.
 */
export function useSilentOTAUpdate() {
  useEffect(() => {
    async function checkAndDownloadUpdate() {
      if (__DEV__ || Platform.OS === "web" || !Updates.isEnabled) {
        console.log(
          "[OTA] Silent OTA updates are disabled in this environment"
        );
        return;
      }

      try {
        console.log("[OTA] Checking for updates...");
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          console.log("[OTA] Update available, downloading silently...");

          await Updates.fetchUpdateAsync();

          console.log(
            "[OTA] Update downloaded successfully. Will apply on next restart."
          );
        } else {
          console.log("[OTA] App is up to date");
        }
      } catch (error) {
        console.error("[OTA] Silent update check failed:", error);
      }
    }

    checkAndDownloadUpdate();
  }, []);
}
