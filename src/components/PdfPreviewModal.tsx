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
  StyleSheet,
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
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.surface },
            { transform: [{ translateY }] },
          ]}
        >
          {/* Drag Handle */}
          <View
            style={styles.dragHandleContainer}
            {...panResponder.panHandlers}
          >
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.surface }]}>
            <Text
              style={[styles.headerTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {filename}
            </Text>
            <TouchableOpacity
              onPress={handleDownload}
              style={styles.downloadButton}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Download size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>

          {/* PDF Viewer */}
          <View style={styles.content}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                  style={[styles.loadingText, { color: colors.textSecondary }]}
                >
                  Loading PDF...
                </Text>
              </View>
            )}
            <WebView
              source={{ uri: pdfViewerUrl }}
              style={styles.pdf}
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: "85%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  downloadButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    position: "relative",
  },
  pdf: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  footer: {
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  downloadButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
