import { router } from 'expo-router';
import { FlaskConical, Library, MessageSquare, Users } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useAlertStore } from '@/src/store/alertStore';
import { useSafeAreaStore } from '@/src/store/safeAreaStore';

import {
  DesktopHomeHeader,
  MenuItem,
  NextClassCard,
  QuickAccessActionCards,
  QuickAccessGrid,
  WelcomeCard,
} from '../components';
import { useHomeData } from '../hooks';

export default function Home() {
  const { bottomOffset } = useSafeAreaStore();
  const { showAlert } = useAlertStore();
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();

  const MENU_ITEMS: MenuItem[] = [
    {
      id: 'virtual-labs',
      title: 'Virtual Labs',
      icon: FlaskConical,
      color: colors.info,
      description: 'Explore interactive science experiments online.',
    },
    {
      id: 'library',
      title: 'Library',
      icon: Library,
      color: colors.success,
      description: 'Browse books, journals & digital resources.',
    },
    {
      id: 'feedback',
      title: 'Feedback',
      icon: MessageSquare,
      color: colors.warning,
      description: 'Share suggestions and report issues.',
    },
    {
      id: 'connect',
      title: 'Connect',
      icon: Users,
      color: colors.violet,
      description: 'View faculty contacts and staff directory.',
    },
  ];

  const {
    loginData,
    userData,
    attendanceData,
    loadingAttendance,
    getNextClass,
    getFormattedTime,
  } = useHomeData();

  const nextClass = getNextClass();

  const handleMenuItemPress = (itemId: string) => {
    if (itemId === 'virtual-labs') {
      router.push('/virtual-labs');
    } else if (itemId === 'library') {
      router.push('/library');
    } else if (itemId === 'connect') {
      router.push('/connect');
    } else if (itemId === 'feedback') {
      router.push('/feedback');
    } else {
      showAlert({
        title: MENU_ITEMS.find((item) => item.id === itemId)?.title || 'Feature',
        message: 'Coming soon!',
      });
    }
  };

  if (isDesktopWeb) {
    const pct = attendanceData?.pcent ?? 0;
    const attended = attendanceData?.attd ?? 0;
    const total = attendanceData?.total_class ?? 0;
    const missed = total - attended;
    const statusColor =
      pct >= 75 ? colors.success : pct >= 60 ? colors.warning : colors.danger;
    const statusBg =
      pct >= 75 ? colors.successBg : pct >= 60 ? colors.warningBg : colors.dangerBg;
    const statusLabel = pct >= 75 ? 'On Track' : pct >= 60 ? 'At Risk' : 'Critical';

    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={1280}>
            <DesktopHomeHeader
              userName={loginData?.student_name || 'Student'}
              profileImageUrl={userData?.profile_pict_cur_url}
              courseName={loginData?.batch_name || 'CSE AI & ML'}
              collegeName={loginData?.college_sht_name || 'N/A'}
              attendancePercentage={pct}
              attendedClass={attended}
              totalClass={total}
              loadingAttendance={loadingAttendance}
            />

            <View className="flex-row gap-7 items-start">
              <View className="flex-[3] gap-0">
                {nextClass && (
                  <NextClassCard
                    className={
                      nextClass.subject_name.split(' - ')[1]?.trim() ||
                      nextClass.subject_name
                    }
                    faculty={nextClass.faculty}
                    time={getFormattedTime(nextClass.Period_name).time}
                    period={getFormattedTime(nextClass.Period_name).period}
                    isFallback={(nextClass as any)._isFallback}
                    onSeeAll={() => router.push('/academics')}
                  />
                )}
                <QuickAccessActionCards
                  items={MENU_ITEMS}
                  onItemPress={handleMenuItemPress}
                />
              </View>

              <View className="flex-[2] gap-4">
                <View className="bg-surface rounded-[20px] p-6 border border-border">
                  <View className="flex-row items-center gap-2 mb-5">
                    <View
                      className="rounded-full px-2.5 py-1"
                      style={{ backgroundColor: statusBg }}
                    >
                      <Text
                        className="text-[11px] font-semibold tracking-wide font-sans"
                        style={{ color: statusColor }}
                      >
                        {statusLabel}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text
                      className="font-display-bold leading-tight"
                      style={{ fontSize: 48, color: statusColor }}
                    >
                      {pct}
                      <Text className="text-xl font-sans text-ink-400">%</Text>
                    </Text>
                    <Text className="text-[13px] text-ink-500 mt-1 font-sans">
                      Overall Attendance
                    </Text>
                  </View>

                  <View className="h-1.5 bg-border rounded-full mb-5 overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        backgroundColor: statusColor,
                      }}
                    />
                  </View>

                  <View className="flex-row justify-between">
                    <View className="items-start">
                      <Text className="text-xl font-bold text-text font-sans">
                        {attended}
                      </Text>
                      <Text className="text-[11px] text-ink-500 mt-0.5 font-sans">
                        Attended
                      </Text>
                    </View>
                    <View className="w-px bg-border mx-2" />
                    <View className="items-start">
                      <Text className="text-xl font-bold text-text font-sans">
                        {missed}
                      </Text>
                      <Text className="text-[11px] text-ink-500 mt-0.5 font-sans">
                        Missed
                      </Text>
                    </View>
                    <View className="w-px bg-border mx-2" />
                    <View className="items-start">
                      <Text className="text-xl font-bold text-text font-sans">
                        {total}
                      </Text>
                      <Text className="text-[11px] text-ink-500 mt-0.5 font-sans">
                        Total
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ContentContainer>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <WelcomeCard
        userName={loginData?.student_name || 'Student'}
        profileImageUrl={userData?.profile_pict_cur_url}
        courseName={loginData?.batch_name || 'CSE AI & ML'}
        collegeName={loginData?.college_sht_name || 'N/A'}
        attendancePercentage={attendanceData?.pcent || 0}
        attendedClass={attendanceData?.attd || 0}
        totalClass={attendanceData?.total_class || 0}
        loadingAttendance={loadingAttendance}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} bounces>
        <View className="px-6 pt-6">
          {nextClass && (
            <NextClassCard
              className={
                nextClass.subject_name.split(' - ')[1]?.trim() || nextClass.subject_name
              }
              faculty={nextClass.faculty}
              time={getFormattedTime(nextClass.Period_name).time}
              period={getFormattedTime(nextClass.Period_name).period}
              isFallback={(nextClass as any)._isFallback}
              onSeeAll={() => router.push('/academics')}
            />
          )}

          <QuickAccessGrid items={MENU_ITEMS} onItemPress={handleMenuItemPress} />
        </View>

        <View style={{ height: bottomOffset + 100 }} />
      </ScrollView>
    </View>
  );
}
