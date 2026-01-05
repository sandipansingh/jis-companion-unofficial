import AlertProvider from "@/src/components/AlertProvider";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { initDatabase } from "@/src/services/database";
import { useAlertStore } from "@/src/store/alertStore";
import { useAuthStore } from "@/src/store/authStore";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <RootLayoutNav />
    </>
  );
}

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { isLoggedIn, checkAuthStatus, syncDataInBackground } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const appState = useRef(AppState.currentState);
  const { isOnline } = useNetworkStatus();
  const wasOfflineRef = useRef(false);
  const { showAlert } = useAlertStore();

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
      const minDisplayTime = 1000;

      if (elapsed < minDisplayTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minDisplayTime - elapsed)
        );
      }

      setIsReady(true);
      SplashScreen.hideAsync();
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
    return null;
  }

  return (
    <ThemeProvider>
      {isLoggedIn ? (
        <Stack
          screenOptions={{
            animation: "slide_from_right",
            title: "JIS Companion (Unofficial)",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="class-details" options={{ headerShown: false }} />
          <Stack.Screen name="virtual-labs" options={{ headerShown: false }} />
          <Stack.Screen name="library" options={{ headerShown: false }} />
        </Stack>
      ) : (
        <Stack
          screenOptions={{
            animation: "slide_from_right",
            title: "JIS Companion (Unofficial)",
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      )}
      <AlertProvider />
    </ThemeProvider>
  );
}
