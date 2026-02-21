import { AlertProvider, DemoBanner, UpdateModal } from "@/src/components";
import { LoadingState } from "@/src/components/LoadingState";
import { ThemeProvider, useTheme } from "@/src/contexts/ThemeContext";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useSilentOTAUpdate } from "@/src/hooks/useSilentOTAUpdate";
import { dismissUpdate, useUpdateCheck } from "@/src/hooks/useUpdateCheck";
import { initDatabase } from "@/src/services/database";
import { useAlertStore } from "@/src/store/alertStore";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { AppState, Platform, View } from "react-native";
import "react-native-reanimated";
import "../../global.css";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    "ClashDisplay-Bold":     require("../../assets/fonts/ClashDisplay-Bold.otf"),
    "ClashDisplay-Semibold": require("../../assets/fonts/ClashDisplay-Semibold.otf"),
    "ClashDisplay-Medium":   require("../../assets/fonts/ClashDisplay-Medium.otf"),
    "ClashDisplay-Regular":  require("../../assets/fonts/ClashDisplay-Regular.otf"),
    "GeneralSans-Bold":      require("../../assets/fonts/GeneralSans-Bold.otf"),
    "GeneralSans-Semibold":  require("../../assets/fonts/GeneralSans-Semibold.otf"),
    "GeneralSans-Medium":    require("../../assets/fonts/GeneralSans-Medium.otf"),
    "GeneralSans-Regular":   require("../../assets/fonts/GeneralSans-Regular.otf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    // On web, expo-font injects @font-face CSS and fonts load via browser naturally.
    // Don't block rendering — FOUT is better than a white screen.
    if (Platform.OS !== "web") {
      return null;
    }
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { colorScheme } = useTheme();
  const segments = useSegments();
  const router = useRouter();
  const { isLoggedIn, checkAuthStatus, syncDataInBackground } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const appState = useRef(AppState.currentState);
  const { isOnline } = useNetworkStatus();
  const wasOfflineRef = useRef(false);
  const { showAlert } = useAlertStore();
  const { updateAvailable, updateType, appInfo, currentVersion } =
    useUpdateCheck();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useSilentOTAUpdate();

  useEffect(() => {
    const initializeAuth = async () => {
      const startTime = Date.now();

      try {
        await initDatabase();
        await checkAuthStatus();
      } catch (error: any) {
        console.error("Initialization error:", error);

        if (error.message === "INVALID_CREDENTIALS") {
          showAlert({
            title: "Invalid Credentials",
            message:
              "Your stored credentials are invalid. Please login with new credentials.",
          });
        }
      }

      const elapsed = Date.now() - startTime;
      // Only enforce minimum splash screen time on native (splash screen exists there).
      // On web there is no splash screen, so skip the artificial delay.
      const minDisplayTime = Platform.OS === "web" ? 0 : 1000;

      if (elapsed < minDisplayTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minDisplayTime - elapsed),
        );
      }

      setIsReady(true);
      if (Platform.OS !== "web") {
        SplashScreen.hideAsync();
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App came to foreground, syncing data...");
        syncDataInBackground();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isOnline && wasOfflineRef.current) {
      console.log("Network reconnected, syncing data...");
      syncDataInBackground();
    }
    wasOfflineRef.current = !isOnline;
  }, [isOnline]);

  useEffect(() => {
    if (updateAvailable && appInfo && isReady) {
      setShowUpdateModal(true);
    }
  }, [updateAvailable, appInfo, isReady]);

  const handleDismissUpdate = async () => {
    if (appInfo && updateType !== "major") {
      await dismissUpdate(appInfo.version);
      setShowUpdateModal(false);
    }
  };

  const inAuthGroup = segments[0] === "(tabs)";

  useEffect(() => {
    if (!isReady) return;

    const timer = setTimeout(() => {
      if (!isLoggedIn && inAuthGroup) {
        router.replace("/login");
      } else if (isLoggedIn && segments[0] === "login") {
        router.replace("/(tabs)");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoggedIn, segments, isReady, inAuthGroup]);

  if (!isReady || (!isLoggedIn && inAuthGroup)) {
    if (Platform.OS === "web") {
      return <LoadingState />;
    }
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#020617" : "#FAFAFA",
      }}
    >
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        translucent={Platform.OS === "android"}
        backgroundColor="transparent"
      />
      {isLoggedIn ? (
        <Stack
          screenOptions={{
            animation: "slide_from_right",
            title: "JIS Companion (Unofficial)",
            headerShown: false,
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#020617" : "#FAFAFA",
            },
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      ) : (
        <Stack
          screenOptions={{
            animation: "slide_from_right",
            title: "JIS Companion (Unofficial)",
            headerShown: false,
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#020617" : "#FAFAFA",
            },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      )}
      <DemoBanner />
      <AlertProvider />
      {appInfo && Platform.OS === "android" && (
        <UpdateModal
          visible={showUpdateModal}
          updateType={updateType}
          currentVersion={currentVersion}
          appInfo={appInfo}
          onDismiss={handleDismissUpdate}
        />
      )}
    </View>
  );
}
