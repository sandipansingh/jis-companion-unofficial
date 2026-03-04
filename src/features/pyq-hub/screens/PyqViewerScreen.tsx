import { useRouter } from 'expo-router';
import { Download } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Header } from '@/src/components';
import { useTheme } from '@/src/contexts/ThemeContext';
import { device } from '@/src/hooks/useDevice';
import { useFileDownload } from '@/src/hooks/useFileDownload';
import { useAlertStore } from '@/src/store/alertStore';

import { usePyqStore } from '../store/pyqStore';

export default function PyqViewerScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { showAlert } = useAlertStore();

  const selectedPyq = usePyqStore((state) => state.selectedPyq);

  const [webViewLoading, setWebViewLoading] = useState(true);

  const filename =
    selectedPyq?.originalFileName ||
    `${selectedPyq?.subjectName}_${selectedPyq?.year}.pdf`;
  const downloadUrl = selectedPyq?.downloadUrl ?? '';
  const mimeType = selectedPyq?.mimeType ?? '';
  const { download, downloading } = useFileDownload({ downloadUrl, filename, mimeType });

  useEffect(() => {
    if (!selectedPyq) {
      router.back();
    }
  }, [selectedPyq, router]);

  if (!selectedPyq) {
    return (
      <View className="flex-1 bg-base items-center justify-center">
        <ActivityIndicator size="large" color={colors.cta} />
      </View>
    );
  }

  const viewUrl = selectedPyq.viewUrl;

  const isDoc =
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const fileTypeLabel = isDoc
    ? mimeType === 'application/msword'
      ? 'DOC'
      : 'DOCX'
    : 'PDF';

  const useGoogleViewer = isDoc || device.isAndroid;
  const pdfViewerUrl = useGoogleViewer
    ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(viewUrl)}`
    : viewUrl;

  const titleLine = `${selectedPyq.subjectName}${selectedPyq.year ? ` · ${selectedPyq.year}` : ''} [${fileTypeLabel}]`;

  const downloadButton = (
    <TouchableOpacity
      onPress={download}
      disabled={downloading}
      activeOpacity={0.7}
      className="p-1"
    >
      {downloading ? (
        <ActivityIndicator size="small" color={colors.cta} />
      ) : (
        <Download size={22} color={colors.cta} strokeWidth={2} />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-base">
      <Header
        title={titleLine}
        showBackButton
        fallbackRoute="/pyq-hub"
        actionElement={downloadButton}
      />

      <View className="flex-1 relative">
        {webViewLoading && (
          <View className="absolute inset-0 z-10 bg-base items-center justify-center">
            <ActivityIndicator size="large" color={colors.cta} />
            <Text className="text-sm text-ink-500 mt-3 font-sans">Loading PDF...</Text>
          </View>
        )}

        <WebView
          source={{ uri: pdfViewerUrl }}
          style={{ flex: 1 }}
          onLoadStart={() => setWebViewLoading(true)}
          onLoadEnd={() => setWebViewLoading(false)}
          onError={() => {
            setWebViewLoading(false);
            showAlert({ title: 'Error', message: 'Failed to load PDF' });
          }}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          scalesPageToFit
          mixedContentMode="always"
          androidLayerType="hardware"
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs
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
        />
      </View>
    </View>
  );
}
