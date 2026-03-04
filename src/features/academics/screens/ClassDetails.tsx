import { useLocalSearchParams } from 'expo-router';
import { MapPin, User } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { Header, PdfPreviewModal } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import {
  AttendanceStatusCard,
  ClassInfoCard,
  DateInfoCard,
  ResourcesCard,
  TimeBadge,
  TypeBadge,
} from '@/src/features/academics/components';
import { useClassDetails } from '@/src/features/academics/hooks';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

export default function ClassDetails() {
  const { colors, isDark } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const {
    classData,
    loading,
    subject,
    timeRange,
    classType,
    location,
    isFutureClass,
    statValue,
    resources,
    pdfModalVisible,
    selectedPdf,
    openPdfPreview,
    closePdfPreview,
  } = useClassDetails(id);

  return (
    <View className="flex-1 bg-base">
      {isDesktopWeb ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-8 pb-20"
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={1100}>
            <Header
              title="Class Details"
              showBackButton
              fallbackRoute="/(tabs)/academics"
            />

            {loading ? (
              <View className="flex-1 justify-center items-center py-20">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : !classData ? (
              <View className="flex-1 justify-center items-center py-20">
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-[15px] font-sans-md"
                >
                  Class data not found
                </Text>
              </View>
            ) : (
              <View className="gap-5">
                <View
                  className="rounded-[20px] border border-border bg-surface p-7"
                  style={{
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row gap-2 mb-5">
                    <TimeBadge timeRange={timeRange} />
                    <TypeBadge type={classType} />
                  </View>

                  <Text className="text-[32px] text-ink-900 dark:text-white mb-4 leading-tight font-display">
                    {subject.name}
                  </Text>

                  <View className="flex-row items-center gap-5">
                    <View className="flex-row items-center gap-1.5">
                      <MapPin
                        size={14}
                        color={isDark ? colors.ink[400] : colors.ink[500]}
                      />
                      <Text className="text-sm text-ink-500 dark:text-ink-400 font-sans">
                        {location}
                      </Text>
                    </View>
                    <View className="w-px h-4 bg-border" />
                    <View className="flex-row items-center gap-2">
                      <View className="w-6 h-6 rounded-full bg-cobalt-50 dark:bg-cobalt-900/40 border border-border items-center justify-center">
                        <User
                          size={12}
                          color={isDark ? colors.ink[300] : colors.ink[600]}
                        />
                      </View>
                      <Text className="text-sm text-ink-500 dark:text-ink-400 font-sans-md">
                        {classData.faculty || 'Unknown'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-stretch gap-5">
                  <View style={{ flex: 1 }}>
                    <DateInfoCard
                      date={classData.date1 || ''}
                      style={{ flex: 1, marginBottom: 0 }}
                    />
                  </View>

                  {!isFutureClass && statValue?.trim() ? (
                    <View style={{ flex: 2 }}>
                      <AttendanceStatusCard
                        status={statValue}
                        style={{ flex: 1, marginBottom: 0 }}
                      />
                    </View>
                  ) : null}

                  <View style={{ flex: 2 }}>
                    {resources.length > 0 ? (
                      <ResourcesCard
                        resources={resources}
                        onResourcePress={openPdfPreview}
                      />
                    ) : (
                      <View className="rounded-[20px] border border-border p-6 items-center gap-2 bg-surface">
                        <Text
                          style={{ color: colors.textTertiary }}
                          className="text-[13px] font-sans-md text-center"
                        >
                          No resources attached
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
          </ContentContainer>
        </ScrollView>
      ) : (
        <>
          <Header
            title="Class Details"
            showBackButton
            fallbackRoute="/(tabs)/academics"
          />

          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : !classData ? (
            <View className="flex-1 justify-center items-center">
              <Text
                style={{ color: colors.textSecondary }}
                className="text-[15px] font-sans-md"
              >
                Class data not found
              </Text>
            </View>
          ) : (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="p-4">
                <ClassInfoCard
                  subjectName={subject.name}
                  timeRange={timeRange}
                  classType={classType}
                  facultyName={classData.faculty || 'Unknown'}
                  location={location}
                />

                <View>
                  <DateInfoCard date={classData.date1 || ''} />

                  {!isFutureClass && statValue?.trim() ? (
                    <AttendanceStatusCard status={statValue} />
                  ) : null}

                  <View>
                    {resources.length > 0 ? (
                      <ResourcesCard
                        resources={resources}
                        onResourcePress={openPdfPreview}
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </>
      )}

      {selectedPdf && (
        <PdfPreviewModal
          visible={pdfModalVisible}
          url={selectedPdf.url}
          filename={selectedPdf.filename}
          onClose={closePdfPreview}
        />
      )}
    </View>
  );
}
