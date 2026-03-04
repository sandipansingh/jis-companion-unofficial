import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import * as LegacyFileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';

import { useDevice } from '@/src/hooks/useDevice';
import { useAlertStore } from '@/src/store/alertStore';

const SAF_URI_KEY = 'app_saf_downloads_uri';

function buildAndroidDisplayPath(dirUri: string, fileName: string): string {
  const decoded = decodeURIComponent(dirUri);
  const treeMatch = decoded.match(/tree\/([^/?]+)/);
  const docId = treeMatch?.[1] ?? '';

  if (!docId) {
    return `/<folder>/${fileName}`;
  }

  const afterColon = docId.includes(':') ? docId.split(':')[1] : docId;
  const cleaned = afterColon.replace(/^\/+|\/+$/g, '');
  const basePath = cleaned ? `/${cleaned}` : '/<folder>';

  return `${basePath}/${fileName}`;
}

async function getSafDownloadsUri(): Promise<string | null> {
  const stored = await AsyncStorage.getItem(SAF_URI_KEY);
  if (stored) {
    const valid = await LegacyFileSystem.StorageAccessFramework.readDirectoryAsync(
      stored,
    ).catch(() => null);
    if (valid !== null) return stored;
    await AsyncStorage.removeItem(SAF_URI_KEY);
  }

  const result =
    await LegacyFileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!result.granted) return null;

  await AsyncStorage.setItem(SAF_URI_KEY, result.directoryUri);
  return result.directoryUri;
}

const MIME_META: Record<string, { ext: string; uti: string; mime: string }> = {
  'application/pdf': {
    ext: 'pdf',
    uti: 'com.adobe.pdf',
    mime: 'application/pdf',
  },
  'application/msword': {
    ext: 'doc',
    uti: 'com.microsoft.word.doc',
    mime: 'application/msword',
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    ext: 'docx',
    uti: 'org.openxmlformats.wordprocessingml.document',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
};

const DEFAULT_META = { ext: 'bin', uti: 'public.data', mime: 'application/octet-stream' };

interface UseFileDownloadParams {
  downloadUrl: string;
  filename: string;
  mimeType?: string;
}

export function useFileDownload({
  downloadUrl,
  filename,
  mimeType = '',
}: UseFileDownloadParams) {
  const [downloading, setDownloading] = useState(false);
  const { showAlert } = useAlertStore();
  const device = useDevice();

  const meta = MIME_META[mimeType] ?? DEFAULT_META;

  const download = async () => {
    if (device.isWeb) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    let cacheFileUri: string | null = null;

    try {
      setDownloading(true);

      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
      let finalFileName = `${nameWithoutExt}.${meta.ext}`;
      let counter = 1;
      const cacheDir = Paths.cache;

      while (true) {
        const file = new File(cacheDir, finalFileName);
        const exists = await file.exists;
        if (!exists) break;
        counter++;
        finalFileName = `${nameWithoutExt}-${counter}.${meta.ext}`;
      }

      const targetFile = new File(cacheDir, finalFileName);
      cacheFileUri = targetFile.uri;
      await File.downloadFileAsync(downloadUrl, targetFile);

      if (device.isAndroid) {
        const dirUri = await getSafDownloadsUri();
        if (!dirUri) {
          showAlert({
            title: 'Cancelled',
            message: 'Download cancelled: no folder selected.',
          });
          return;
        }

        const safUri = await LegacyFileSystem.StorageAccessFramework.createFileAsync(
          dirUri,
          finalFileName,
          meta.mime,
        );
        const fileContent = await LegacyFileSystem.readAsStringAsync(targetFile.uri, {
          encoding: LegacyFileSystem.EncodingType.Base64,
        });
        await LegacyFileSystem.writeAsStringAsync(safUri, fileContent, {
          encoding: LegacyFileSystem.EncodingType.Base64,
        });

        const displayPath = buildAndroidDisplayPath(dirUri, finalFileName);

        showAlert({
          title: 'Downloaded',
          message: `File saved to:\n${displayPath}`,
        });
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(targetFile.uri, {
            mimeType: meta.mime,
            dialogTitle: 'Save file',
            UTI: meta.uti,
          });
        } else {
          showAlert({ title: 'Downloaded', message: `File saved to: ${targetFile.uri}` });
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      showAlert({
        title: 'Error',
        message: 'Failed to download file. Please try again.',
      });
    } finally {
      if (cacheFileUri) {
        try {
          await LegacyFileSystem.deleteAsync(cacheFileUri, { idempotent: true });
        } catch (cleanupError) {
          console.warn('Failed to clean cached download file:', cleanupError);
        }
      }
      setDownloading(false);
    }
  };

  return { download, downloading };
}
