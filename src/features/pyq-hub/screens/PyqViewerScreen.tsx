import { useRouter } from 'expo-router';
import { Download } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { Header } from '@/src/components';
import { buildViewerUrl, PdfWebView } from '@/src/components/PdfWebView';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useDevice } from '@/src/hooks/useDevice';
import { useFileDownload } from '@/src/hooks/useFileDownload';
import { useAlertStore } from '@/src/store/alertStore';

import { usePyqStore } from '../store/pyqStore';

export default function PyqViewerScreen() {
  const { colors } = useTheme();
  const { isAndroid } = useDevice();
  const router = useRouter();
  const { showAlert } = useAlertStore();

  const selectedPyq = usePyqStore((state) => state.selectedPyq);

  const [webViewLoading, setWebViewLoading] = useState(true);

  const downloadUrl = selectedPyq?.downloadUrl ?? '';
  const mimeType = selectedPyq?.mimeType ?? '';

  const MIME_TO_EXT: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  };
  const ext = MIME_TO_EXT[mimeType] ?? 'pdf';
  const filename =
    selectedPyq?.originalFileName ||
    `${selectedPyq?.subjectName}_${selectedPyq?.year}.${ext}`;
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

  const viewUrl = selectedPyq.viewUrl?.trim() ?? '';
  const hasValidViewUrl = viewUrl.length > 0;

  const isDoc =
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const fileTypeLabel = isDoc
    ? mimeType === 'application/msword'
      ? 'DOC'
      : 'DOCX'
    : 'PDF';

  const forceGoogleViewer = isDoc || isAndroid;
  const pdfViewerUrl = hasValidViewUrl
    ? buildViewerUrl(viewUrl, { isAndroid, forceGoogleViewer })
    : '';

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
        {hasValidViewUrl && webViewLoading && (
          <View className="absolute inset-0 z-10 bg-base items-center justify-center">
            <ActivityIndicator size="large" color={colors.cta} />
            <Text className="text-sm text-ink-500 mt-3 font-sans">Loading PDF...</Text>
          </View>
        )}

        {hasValidViewUrl ? (
          <PdfWebView
            uri={pdfViewerUrl}
            style={{ flex: 1 }}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            onError={() => {
              setWebViewLoading(false);
              showAlert({ title: 'Error', message: 'Failed to load PDF' });
            }}
            onHttpError={(event) => {
              setWebViewLoading(false);
              showAlert({
                title: 'Preview Error',
                message: `Document preview failed (${event.nativeEvent.statusCode}). Try download instead.`,
              });
            }}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-base text-ink-700 dark:text-ink-300 font-sans-semi text-center">
              Invalid or missing document URL.
            </Text>
            <Text className="text-sm text-ink-500 mt-2 text-center font-sans">
              This file cannot be previewed right now. Please go back and try another
              file.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
