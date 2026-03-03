import { router, useFocusEffect } from 'expo-router';
import { ScanLine } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useConnectStore } from '@/src/features/connect/store/connectStore';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

import { ConnectTabs, MyQRView, ScannedContactsView } from '../components';

export default function ConnectScreen() {
  const { colorScheme } = useColorScheme();
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const [activeTab, setActiveTab] = useState<'my-qr' | 'scanned'>('my-qr');
  const [showMyQr, setShowMyQr] = useState(false);
  const studentId = useAuthStore((state) => state.studentId);
  const hasFetchedSocialProfile = useConnectStore(
    (state) => state.hasFetchedSocialProfile,
  );
  const fetchSocialProfile = useConnectStore((state) => state.fetchSocialProfile);
  const fetchScannedContacts = useConnectStore((state) => state.fetchScannedContacts);

  useEffect(() => {
    const timer = setTimeout(() => setShowMyQr(true), 120);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!studentId) return;
    const timer = setTimeout(() => fetchSocialProfile(studentId), 0);
    return () => clearTimeout(timer);
  }, [studentId, fetchSocialProfile]);

  // Desktop: fetch both panels on mount since both are always visible
  useEffect(() => {
    if (!isDesktopWeb || !studentId) return;
    const t = setTimeout(() => fetchScannedContacts(studentId), 50);
    return () => clearTimeout(t);
  }, [isDesktopWeb, studentId, fetchScannedContacts]);

  // Mobile: fetch scanned contacts only when that tab is active
  useFocusEffect(
    useCallback(() => {
      if (isDesktopWeb || !studentId || activeTab !== 'scanned') return;
      const timer = setTimeout(() => fetchScannedContacts(studentId), 0);
      return () => clearTimeout(timer);
    }, [isDesktopWeb, studentId, activeTab, fetchScannedContacts]),
  );

  if (isDesktopWeb) {
    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-8 pb-20"
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={1280}>
            <Header
              title="Connect"
              showBackButton
              fallbackRoute="/(tabs)"
              actionElement={
                <TouchableOpacity
                  onPress={() => router.push('/connect/scan')}
                  className="flex-row items-center gap-2 py-2 px-3.5 rounded-[10px] border border-border bg-surface"
                  accessibilityLabel="Scan QR"
                  accessibilityRole="button"
                >
                  <ScanLine size={16} color={colors.primary} />
                  <Text
                    style={{ color: colors.primary }}
                    className="text-[13px] font-sans-semi"
                  >
                    Scan QR
                  </Text>
                </TouchableOpacity>
              }
            />

            <View className="flex-row items-start gap-6">
              <View
                className="rounded-[20px] border border-border overflow-hidden bg-surface"
                style={{
                  flex: 5,
                }}
              >
                <View className="px-5 pt-[18px] pb-3.5 border-b border-border">
                  <Text
                    style={{ color: colors.text, letterSpacing: -0.2 }}
                    className="text-[15px] font-sans-bold"
                  >
                    My QR Code
                  </Text>
                </View>
                {showMyQr && hasFetchedSocialProfile ? (
                  <MyQRView />
                ) : (
                  <View className="min-h-80 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                )}
              </View>

              <View
                className="rounded-[20px] border border-border overflow-hidden min-h-[480px] bg-surface"
                style={{
                  flex: 7,
                }}
              >
                <View className="px-5 pt-[18px] pb-3.5 border-b border-border">
                  <Text
                    style={{ color: colors.text, letterSpacing: -0.2 }}
                    className="text-[15px] font-sans-bold"
                  >
                    Scanned Contacts
                  </Text>
                </View>
                <ScannedContactsView />
              </View>
            </View>
          </ContentContainer>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <Header
        title="Connect"
        actionElement={
          <TouchableOpacity
            className="items-center justify-center p-2"
            onPress={() => router.push('/connect/scan')}
            accessibilityLabel="Scan QR"
            accessibilityRole="button"
          >
            <ScanLine size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
        }
        showBackButton
      />

      <View className="p-4">
        <ConnectTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      <View className="flex-1">
        <View
          className="flex-1"
          style={{ display: activeTab === 'my-qr' ? 'flex' : 'none' }}
        >
          {showMyQr && hasFetchedSocialProfile ? (
            <MyQRView />
          ) : (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
        <View
          className="flex-1"
          style={{ display: activeTab === 'scanned' ? 'flex' : 'none' }}
        >
          <ScannedContactsView />
        </View>
      </View>
    </View>
  );
}
