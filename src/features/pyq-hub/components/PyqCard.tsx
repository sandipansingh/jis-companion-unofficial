import { useRouter } from 'expo-router';
import { BookOpen, Calendar, ChevronRight, Download } from 'lucide-react-native';
import { Platform, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useFileDownload } from '@/src/hooks/useFileDownload';

import { usePyqStore } from '../store/pyqStore';
import { Pyq } from '../types';

interface PyqCardProps {
  item: Pyq;
}

const EXAM_TYPE_COLORS: Record<string, string> = {
  REGULAR: '#10B981',
  BACKLOG: '#EF4444',
  RETAKE: '#F59E0B',
  SUPPLE: '#8B5CF6',
};

export function PyqCard({ item }: PyqCardProps) {
  const { colors, isDark } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const router = useRouter();
  const setSelectedPyq = usePyqStore((state) => state.setSelectedPyq);

  const examColor = EXAM_TYPE_COLORS[item.examType] ?? colors.cta;
  const examBg = examColor + (isDark ? '30' : '18');

  const filename = item.originalFileName || `${item.subjectName}.pdf`;
  const { download } = useFileDownload({
    downloadUrl: item.downloadUrl,
    filename,
    mimeType: item.mimeType,
  });

  const handlePress = () => {
    if (Platform.OS === 'web') {
      window.open(item.viewUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setSelectedPyq(item);
    router.push(`/pyq-hub/pdf/${item.$id}` as any);
  };

  const handleDownload = (e: any) => {
    e.stopPropagation?.();
    download();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.subjectName}${item.subjectCode ? `, code ${item.subjectCode}` : ''}`}
      className={`
        mx-4 mb-2.5 p-4 rounded-[14px] border border-border
        bg-surface
        web:hover:bg-overlay dark:web:hover:bg-elevated
        web:transition-colors web:duration-150
        ${isDesktopWeb ? 'flex-1' : ''}
      `}
      style={({ pressed }: any) => ({
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
        ...(pressed ? { backgroundColor: colors.overlay } : {}),
        ...(isDesktopWeb
          ? ({
              cursor: 'pointer',
            } as any)
          : {}),
      })}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-start gap-3 flex-1 mr-2">
          <View
            className="w-9 h-9 rounded-xl items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: colors.ctaSoft }}
          >
            <BookOpen size={17} color={colors.cta} strokeWidth={1.8} />
          </View>

          <View className="flex-1">
            <Text
              className="text-[14px] font-sans-semi text-text leading-5"
              numberOfLines={3}
            >
              {item.subjectName}
            </Text>
            {item.subjectCode ? (
              <Text className="text-[11px] text-ink-500 dark:text-ink-400 font-sans mt-0.5">
                {item.subjectCode}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="items-center gap-2.5">
          <ChevronRight size={16} color={colors.textTertiary} strokeWidth={2} />
        </View>
      </View>

      <View className="flex-row flex-wrap items-center gap-1.5">
        {item.year ? (
          <View
            className="flex-row items-center gap-1 px-2 py-0.5 rounded-md"
            style={{ backgroundColor: colors.elevated }}
          >
            <Calendar size={10} color={colors.textTertiary} strokeWidth={2} />
            <Text className="text-[10px] font-sans-md text-ink-600 dark:text-ink-400">
              {item.year}
            </Text>
          </View>
        ) : null}

        {item.program ? (
          <View
            className="px-2 py-0.5 rounded-md"
            style={{ backgroundColor: colors.elevated }}
          >
            <Text className="text-[10px] font-sans-md text-ink-600 dark:text-ink-400">
              {item.program}
            </Text>
          </View>
        ) : null}

        {item.semester ? (
          <View
            className="px-2 py-0.5 rounded-md"
            style={{ backgroundColor: colors.elevated }}
          >
            <Text className="text-[10px] font-sans-md text-ink-600 dark:text-ink-400">
              Sem {item.semester}
            </Text>
          </View>
        ) : null}

        {item.examType ? (
          <View className="px-2 py-0.5 rounded-md" style={{ backgroundColor: examBg }}>
            <Text className="text-[10px] font-sans-semi" style={{ color: examColor }}>
              {item.examType}
            </Text>
          </View>
        ) : null}

        {item.streams?.map((stream, index) => (
          <View
            key={`${stream}-${index}`}
            className="px-2 py-0.5 rounded-md"
            style={{ backgroundColor: colors.ctaSoft }}
          >
            <Text className="text-[10px] font-sans" style={{ color: colors.cta }}>
              {stream}
            </Text>
          </View>
        ))}

        <Pressable
          onPress={handleDownload}
          hitSlop={8}
          className="ml-auto"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Download ${item.subjectName}`}
          accessibilityHint="Downloads this question paper to your device"
          style={({ pressed }: any) => ({
            opacity: pressed ? 0.5 : 1,
            ...(isDesktopWeb ? ({ cursor: 'pointer' } as any) : {}),
          })}
        >
          <Download size={18} color={colors.cta} strokeWidth={2} />
        </Pressable>
      </View>
    </Pressable>
  );
}
