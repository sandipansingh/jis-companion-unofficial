import { ChevronRight, FlaskConical } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { Button, Header, HeaderCard } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { getTabIndicatorColor, getTabLabelColor } from '@/src/constants/tabColors';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

import { CourseDropdown } from '../components';
import { useCourseSelectionData } from '../hooks/useCourseSelectionData';

interface SelectionPanelProps {
  title: string;
  step: number;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  enabled?: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
}

function SelectionPanel({
  title,
  step,
  options,
  selectedValue,
  onSelect,
  enabled = true,
  colors,
  isDark,
}: SelectionPanelProps) {
  const isDisabled = !enabled;

  return (
    <View
      className="flex-1 bg-surface overflow-hidden rounded-xl border"
      style={{
        borderColor: colors.border,
        opacity: isDisabled ? 0.45 : 1,
      }}
    >
      <View
        className="flex-row items-center gap-[10px] px-[18px] py-[11px] border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <View
          className="items-center justify-center w-[22px] h-[22px] rounded-full"
          style={{ backgroundColor: colors.cta }}
        >
          <Text className="font-sans-bold text-[11px]" style={{ color: colors.onCta }}>
            {step}
          </Text>
        </View>
        <Text
          className="font-sans-bold text-sm tracking-[-0.2px]"
          style={{ color: colors.text }}
        >
          {title}
        </Text>
      </View>

      <View className="max-h-[240px]">
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.length === 0 ? (
            <View className="items-center p-5">
              <Text
                className="font-sans text-center text-[13px]"
                style={{ color: colors.textTertiary }}
              >
                {isDisabled ? 'Select previous step first' : 'No options available'}
              </Text>
            </View>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => !isDisabled && onSelect(opt.value)}
                  style={
                    ((state: any) => ({
                      flexDirection: 'row' as const,
                      alignItems: 'center' as const,
                      paddingHorizontal: 18,
                      paddingVertical: 9,
                      backgroundColor: isSelected
                        ? getTabIndicatorColor(isDark)
                        : state.hovered && !isDisabled
                          ? colors.elevated
                          : 'transparent',
                      cursor: isDisabled ? 'default' : 'pointer',
                      transition: 'background-color 120ms',
                      borderLeftWidth: 3,
                      borderLeftColor: isSelected
                        ? getTabLabelColor(isDark, true)
                        : 'transparent',
                    })) as any
                  }
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: isSelected ? 'Inter_600SemiBold' : 'Inter_400Regular',
                      color: isSelected ? getTabLabelColor(isDark, true) : colors.text,
                    }}
                    numberOfLines={2}
                    className="flex-1"
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default function CourseSelection() {
  const { colors, isDark } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const {
    courses,
    loading,
    selectedCourse,
    selectedStream,
    selectedSemester,
    courseOptions,
    streamOptions,
    semesterOptions,
    courseDropdownVisible,
    streamDropdownVisible,
    semesterDropdownVisible,
    setCourseDropdownVisible,
    setStreamDropdownVisible,
    setSemesterDropdownVisible,
    handleCourseSelect,
    handleStreamSelect,
    handleSemesterSelect,
    handleProceed,
  } = useCourseSelectionData();

  const canProceed = !!selectedCourse && !!selectedStream && !!selectedSemester;

  return (
    <View className="flex-1 bg-base">
      {isDesktopWeb ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={960}>
            <Header title="Virtual Labs" showBackButton fallbackRoute="/(tabs)" />
            {loading && courses.length === 0 ? (
              <View className="items-center justify-center py-20 gap-3">
                <ActivityIndicator size="large" color={colors.cta} />
                <Text
                  className="font-sans text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  Loading courses...
                </Text>
              </View>
            ) : (
              <>
                <View className="flex-row items-center gap-1.5 mb-6">
                  <FlaskConical size={16} color={colors.cta} />
                  <Text
                    className="font-sans-md text-[13px]"
                    style={{ color: colors.textSecondary }}
                  >
                    Lab Configuration
                  </Text>
                  {selectedCourse && (
                    <>
                      <ChevronRight size={14} color={colors.border} />
                      <Text
                        className="font-sans-semi text-[13px]"
                        numberOfLines={1}
                        style={{ color: colors.text }}
                      >
                        {selectedCourse}
                      </Text>
                    </>
                  )}
                  {selectedStream && (
                    <>
                      <ChevronRight size={14} color={colors.border} />
                      <Text
                        className="font-sans-semi text-[13px]"
                        numberOfLines={1}
                        style={{ color: colors.text }}
                      >
                        {selectedStream}
                      </Text>
                    </>
                  )}
                  {selectedSemester && (
                    <>
                      <ChevronRight size={14} color={colors.border} />
                      <Text
                        className="font-sans-semi text-[13px]"
                        style={{ color: colors.cta }}
                      >
                        Sem {selectedSemester}
                      </Text>
                    </>
                  )}
                </View>

                <View className="flex-row items-start gap-5">
                  <SelectionPanel
                    title="Course"
                    step={1}
                    options={courseOptions}
                    selectedValue={selectedCourse}
                    onSelect={handleCourseSelect}
                    colors={colors}
                    isDark={isDark}
                  />
                  <SelectionPanel
                    title="Stream"
                    step={2}
                    options={streamOptions}
                    selectedValue={selectedStream}
                    onSelect={handleStreamSelect}
                    enabled={!!selectedCourse}
                    colors={colors}
                    isDark={isDark}
                  />
                  <SelectionPanel
                    title="Semester"
                    step={3}
                    options={semesterOptions}
                    selectedValue={selectedSemester}
                    onSelect={handleSemesterSelect}
                    enabled={!!selectedCourse && !!selectedStream}
                    colors={colors}
                    isDark={isDark}
                  />
                </View>

                <View className="items-end mt-5">
                  <Pressable
                    onPress={canProceed ? handleProceed : undefined}
                    disabled={!canProceed}
                    style={({ pressed, hovered }: any) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      borderRadius: 12,
                      opacity: canProceed ? 1 : 0.55,
                      backgroundColor: !canProceed
                        ? colors.elevated
                        : pressed
                          ? colors.cta + 'CC'
                          : hovered
                            ? colors.cta + 'EE'
                            : colors.cta,
                      borderWidth: 1,
                      borderColor: canProceed ? colors.cta : colors.border,
                      cursor: canProceed ? 'pointer' : 'auto',
                      transition: 'background-color 120ms, opacity 120ms',
                    })}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !canProceed }}
                  >
                    <FlaskConical
                      size={16}
                      color={canProceed ? colors.onCta : colors.textTertiary}
                    />
                    <Text
                      className="font-sans-semi text-sm"
                      style={{ color: canProceed ? colors.onCta : colors.textTertiary }}
                    >
                      View Experiments
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </ContentContainer>
        </ScrollView>
      ) : (
        <>
          <Header title="Virtual Labs" showBackButton />
          {loading && courses.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-3">
              <ActivityIndicator size="large" color={colors.cta} />
              <Text className="text-sm text-ink-500 font-sans">Loading courses...</Text>
            </View>
          ) : (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="px-5 pt-6 pb-2 gap-5">
                <HeaderCard
                  variant="hero"
                  title="Lab Configuration"
                  description="Select your course details to view available virtual experiments."
                  icon={FlaskConical}
                />

                <View className="gap-3">
                  <CourseDropdown
                    label="COURSE"
                    value={selectedCourse}
                    placeholder="Select Course"
                    options={courseOptions}
                    visible={courseDropdownVisible}
                    onOpen={() => setCourseDropdownVisible(true)}
                    onClose={() => setCourseDropdownVisible(false)}
                    onSelect={handleCourseSelect}
                  />

                  {selectedCourse && (
                    <CourseDropdown
                      label="STREAM"
                      value={selectedStream}
                      placeholder="Select Stream"
                      options={streamOptions}
                      visible={streamDropdownVisible}
                      onOpen={() => setStreamDropdownVisible(true)}
                      onClose={() => setStreamDropdownVisible(false)}
                      onSelect={handleStreamSelect}
                    />
                  )}

                  {selectedCourse && selectedStream && (
                    <CourseDropdown
                      label="SEMESTER"
                      value={selectedSemester ? `Semester ${selectedSemester}` : ''}
                      placeholder="Select Semester"
                      options={semesterOptions}
                      visible={semesterDropdownVisible}
                      onOpen={() => setSemesterDropdownVisible(true)}
                      onClose={() => setSemesterDropdownVisible(false)}
                      onSelect={handleSemesterSelect}
                    />
                  )}
                </View>

                {canProceed && (
                  <Button title="View Experiments" onPress={handleProceed} />
                )}
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}
