import { useAuthStore } from "@/src/features/auth/store/authStore";
import { useConnectStore } from "@/src/features/connect/store/connectStore";
import { decryptPayload } from "@/src/features/connect/utils/payload";
import { useAlertStore } from "@/src/store/alertStore";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  const { studentId } = useAuthStore();
  const { addScannedContact } = useConnectStore();
  const { showAlert } = useAlertStore();
  const isScanning = useRef(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-base p-4">
        <Text className="text-lg text-center mb-4 text-ink-900 dark:text-white font-display">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-cobalt-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-sans-semi">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (isScanning.current) return;
    isScanning.current = true;

    try {
      const payload = decryptPayload(data);
      if (payload && payload.fullName) {
        if (studentId) {
          await addScannedContact(studentId, payload);
          showAlert({
            title: "Success",
            message: `Added ${payload.fullName} to your contacts!`,
            onConfirm: () => {
              setTimeout(() => {
                isScanning.current = false;
              }, 1000);
            },
          });
        }
      } else {
        showAlert({
          title: "Invalid QR Code",
          message: "This QR code is not a valid JIS Companion profile.",
          isDestructive: true,
          onConfirm: () => {
            setTimeout(() => {
              isScanning.current = false;
            }, 1000);
          },
        });
      }
    } catch (error: any) {
      console.error("Scan error:", error);
      showAlert({
        title: "Error",
        message: error.message || "Failed to read QR code.",
        isDestructive: true,
        onConfirm: () => {
          setTimeout(() => {
             isScanning.current = false;
          }, 1000);
        },
      });
    }
  };

  return (
    <View className="flex-1 bg-black">
      <View
        className="absolute top-0 left-0 right-0 z-10 flex-row items-center p-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black/50 p-2 rounded-full"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Scan Profile</Text>
      </View>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      <View className="absolute bottom-0 left-0 right-0 p-8 items-center">
        <View className="bg-black/50 px-6 py-3 rounded-full">
          <Text className="text-white text-center">
            Align QR code within the frame to scan
          </Text>
        </View>
      </View>
    </View>
  );
}
