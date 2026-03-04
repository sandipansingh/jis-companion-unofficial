import '../../global.css';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { AppState, Platform, View } from 'react-native';

import { AlertProvider, DemoBanner, UpdateModal } from '@/src/components';
import { LoadingState } from '@/src/components/LoadingState';
import { ThemeProvider, useTheme } from '@/src/contexts/ThemeContext';
import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';
import { useSilentOTAUpdate } from '@/src/hooks/useSilentOTAUpdate';
import { dismissUpdate, useUpdateCheck } from '@/src/hooks/useUpdateCheck';
import { initDatabase } from '@/src/services/database';
import { useAlertStore } from '@/src/store/alertStore';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    if (Platform.OS !== 'web') {
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
  const { colorScheme, colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();
  const { isLoggedIn, isLoggingOut, checkAuthStatus, syncDataInBackground } =
    useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const appState = useRef(AppState.currentState);
  const { isOnline } = useNetworkStatus();
  const wasOfflineRef = useRef(false);
  const { showAlert } = useAlertStore();
  const { updateAvailable, updateType, appInfo, currentVersion } = useUpdateCheck();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useSilentOTAUpdate();

  useEffect(() => {
    const initializeAuth = async () => {
      const startTime = Date.now();

      try {
        await initDatabase();
        await checkAuthStatus();
      } catch (error: unknown) {
        console.error('Initialization error:', error);

        if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
          showAlert({
            title: 'Invalid Credentials',
            message:
              'Your stored credentials are invalid. Please login with new credentials.',
          });
        }
      }

      const elapsed = Date.now() - startTime;
      const minDisplayTime = Platform.OS === 'web' ? 0 : 1000;

      if (elapsed < minDisplayTime) {
        await new Promise((resolve) => setTimeout(resolve, minDisplayTime - elapsed));
      }

      setIsReady(true);
      if (Platform.OS !== 'web') {
        try {
          await SplashScreen.hideAsync();
        } catch {
          // Ignore error
        }
      }
    };
    initializeAuth();
  }, [checkAuthStatus, showAlert]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        syncDataInBackground();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [syncDataInBackground]);

  useEffect(() => {
    if (isOnline && wasOfflineRef.current) {
      syncDataInBackground();
    }
    wasOfflineRef.current = !isOnline;
  }, [isOnline, syncDataInBackground]);

  useEffect(() => {
    if (updateAvailable && appInfo && isReady) {
      setShowUpdateModal(true);
    }
  }, [updateAvailable, appInfo, isReady]);

  const handleDismissUpdate = async () => {
    if (appInfo && updateType !== 'major') {
      await dismissUpdate(appInfo.version);
      setShowUpdateModal(false);
    }
  };

  const PUBLIC_ROUTES = ['login', 'legal', '+not-found'];
  const isPublicRoute =
    segments.length > 0 && PUBLIC_ROUTES.includes(segments[0] as string);

  useEffect(() => {
    if (!isReady) return;

    if (!isLoggedIn && !isPublicRoute) {
      router.replace('/login');
    } else if (isLoggedIn && segments[0] === 'login') {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, isReady, isPublicRoute, router]);

  if (!isReady || (!isLoggedIn && !isPublicRoute && !isLoggingOut)) {
    if (Platform.OS === 'web') {
      return <LoadingState />;
    }
    return null;
  }

  return (
    <View className="flex-1 bg-base">
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        translucent={Platform.OS === 'android'}
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          title: 'JIS Companion (Unofficial)',
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.base,
          },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <DemoBanner />
      <AlertProvider />
      {appInfo && Platform.OS === 'android' && (
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
