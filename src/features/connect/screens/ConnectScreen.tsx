import { Header } from "@/src/components";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { useConnectStore } from "@/src/features/connect/store/connectStore";
import { router, useFocusEffect } from "expo-router";
import { ScanLine } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { ConnectTabs, MyQRView, ScannedContactsView } from "../components";

export  default function ConnectScreen() {
  const { colorScheme } = useColorScheme();
  const [activeTab, setActiveTab] = useState<"my-qr" | "scanned">("my-qr");
  const [showMyQr, setShowMyQr] = useState(false);
  const studentId = useAuthStore((state) => state.studentId);
  const hasFetchedSocialProfile = useConnectStore((state) => state.hasFetchedSocialProfile);
  const fetchSocialProfile = useConnectStore((state) => state.fetchSocialProfile);
  const fetchScannedContacts = useConnectStore((state) => state.fetchScannedContacts);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMyQr(true);
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!studentId) return;
    const timer = setTimeout(() => {
      fetchSocialProfile(studentId);
    }, 0);

    return () => clearTimeout(timer);
  }, [studentId, fetchSocialProfile]);

  useFocusEffect(
    useCallback(() => {
      if (!studentId || activeTab !== "scanned") return;

      const timer = setTimeout(() => {
        fetchScannedContacts(studentId);
      }, 0);

      return () => clearTimeout(timer);
    }, [studentId, activeTab, fetchScannedContacts])
  );


  return (
    <View
      className="flex-1 bg-base"
      >
        <Header
            title="Connect"
            actionElement={
            <TouchableOpacity
                className="items-center justify-center p-2"
                onPress={() => router.push("/connect/scan")}
                accessibilityLabel="Scan QR"
                accessibilityRole="button"
            >
                <ScanLine size={24} color={colorScheme === "dark" ? "white" : "black"}  />
            </TouchableOpacity>
            }
            showBackButton
        />
          
      <View className="p-4">
        <ConnectTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      <View className="flex-1">
        <View style={{ display: activeTab === "my-qr" ? "flex" : "none", flex: 1 }}>
          {showMyQr && hasFetchedSocialProfile ? (
            <MyQRView />
          ) : (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
        <View style={{ display: activeTab === "scanned" ? "flex" : "none", flex: 1 }}>
          <ScannedContactsView />
        </View>
      </View>
    </View>
  );
};
