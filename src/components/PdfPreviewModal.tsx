import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Download } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Modal,
    PanResponder,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";

interface PdfPreviewModalProps {
  visible: boolean;
  url: string;
  filename: string;
  onClose: () => void;
}

export function PdfPreviewModal({
  visible,
  url,
  filename,
  onClose,
}: PdfPreviewModalProps) {
  const { colors } = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const { showAlert } = useAlertStore();

  const pdfViewerUrl =
    Platform.OS === "android"
      ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
          url
        )}`
      : url;

  const handleClose = () => {
    onClose();
    setTimeout(() => translateY.setValue(0), 100);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            handleClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

      let finalFileName = `${nameWithoutExt}.pdf`;
      let counter = 1;
      const cacheDir = Paths.cache;

      while (true) {
        const file = new File(cacheDir, finalFileName);
        const exists = await file.exists;
        if (!exists) {
          break;
        }
        counter++;
        finalFileName = `${nameWithoutExt}-${counter}.pdf`;
      }

      const targetFile = new File(cacheDir, finalFileName);
      await File.downloadFileAsync(url, targetFile);

      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(targetFile.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Save PDF",
          UTI: "com.adobe.pdf",
        });
        showAlert({
          title: "Success",
          message: "File downloaded successfully!",
        });
      } else {
        showAlert({
          title: "Downloaded",
          message: `File saved to: ${targetFile.uri}`,
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      showAlert({
        title: "Error",
        message: "Failed to download file. Please try again.",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      transparent
    >
      <View className="flex-1 justify-end">
        <TouchableOpacity
          className="absolute inset-0 bg-black/50"
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          className="h-[85%] rounded-t-3xl overflow-hidden bg-white"
          style={[{ transform: [{ translateY }] }]}
        >
          {/* Drag Handle */}
          <View className="items-center py-3" {...panResponder.panHandlers}>
            <View className="w-10 h-1 rounded-full bg-ink-300" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between py-4 px-4 bg-white border-b border-border">
            <Text
              className="flex-1 text-base font-semibold text-ink-900 mr-4"
              numberOfLines={1}
              style={{ fontFamily: "ClashDisplay-Medium" }}
            >
              {filename}
            </Text>
            <TouchableOpacity
              onPress={handleDownload}
              className="p-1"
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator color="#2B5BDB" />
              ) : (
                <Download size={24} color="#2B5BDB" />
              )}
            </TouchableOpacity>
          </View>

          {/* PDF Viewer */}
          <View className="flex-1 relative">
            {loading && (
              <View className="absolute inset-0 justify-center items-center z-10 bg-white">
                <ActivityIndicator size="large" color="#2B5BDB" />
                <Text
                  className="mt-3 text-sm text-ink-500"
                  style={{ fontFamily: "GeneralSans-Regular" }}
                >
                  Loading PDF...
                </Text>
              </View>
            )}
            <WebView
              source={{ uri: pdfViewerUrl }}
              className="flex-1 bg-transparent"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                showAlert({
                  title: "Error",
                  message: "Failed to load PDF",
                });
              }}
              originWhitelist={["*"]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              injectedJavaScript={`
                const meta = document.createElement('meta');
                meta.setAttribute('content', 'width=device-width, initial-scale=1');
                meta.setAttribute('name', 'viewport');
                document.getElementsByTagName('head')[0].appendChild(meta);
                const style = document.createElement('style');
                style.innerHTML = '.ndfHFb-c4YZDc-Wrql6b, .ndfHFb-c4YZDc, div[role="toolbar"], [aria-label="Pop-out"] { display: none !important; }';
                document.head.appendChild(style);
                true;
              `}
              mixedContentMode="always"
              androidLayerType="hardware"
              allowFileAccess={true}
              allowFileAccessFromFileURLs={true}
              allowUniversalAccessFromFileURLs={true}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
