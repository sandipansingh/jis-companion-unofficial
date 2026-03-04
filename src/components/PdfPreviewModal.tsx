import { Download } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { useDevice } from '@/src/hooks/useDevice';
import { useFileDownload } from '@/src/hooks/useFileDownload';

import { useAlertStore } from '../store/alertStore';
import { buildViewerUrl, PdfWebView } from './PdfWebView';

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
  const { isAndroid } = useDevice();
  const [loading, setLoading] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const { showAlert } = useAlertStore();

  const { download, downloading } = useFileDownload({
    downloadUrl: url,
    filename,
    mimeType: 'application/pdf',
  });

  const pdfViewerUrl = buildViewerUrl(url, { isAndroid });

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
    }),
  ).current;

  const handleDownload = () => {
    download();
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
          className="h-[85%] rounded-t-3xl overflow-hidden bg-surface"
          style={[{ transform: [{ translateY }] }]}
        >
          <View className="items-center py-3" {...panResponder.panHandlers}>
            <View className="w-10 h-1 rounded-full bg-ink-300" />
          </View>

          <View className="flex-row items-center justify-between py-4 px-4 bg-surface border-b border-border">
            <Text
              className="flex-1 text-base font-semibold text-ink-900 mr-4 font-display-md"
              numberOfLines={1}
            >
              {filename}
            </Text>
            <TouchableOpacity
              onPress={handleDownload}
              className="p-1"
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Download size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-1 relative">
            {loading && (
              <View className="absolute inset-0 justify-center items-center z-10 bg-surface">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="mt-3 text-sm text-ink-500 font-sans">
                  Loading PDF...
                </Text>
              </View>
            )}
            <PdfWebView
              uri={pdfViewerUrl}
              className="flex-1 bg-transparent"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                showAlert({ title: 'Error', message: 'Failed to load PDF' });
              }}
              onHttpError={(event) => {
                setLoading(false);
                showAlert({
                  title: 'Preview Error',
                  message: `Document preview failed (${event.nativeEvent.statusCode}). Try download instead.`,
                });
              }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
