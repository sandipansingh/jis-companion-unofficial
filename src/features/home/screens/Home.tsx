import { router } from 'expo-router';
import {
  FileText,
  FlaskConical,
  Library,
  MessageSquare,
  Users,
} from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

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
      description: 'Connect with your peers and faculty.',
    },
    {
      id: 'pyq-hub',
      title: 'PYQ Hub',
      icon: FileText,
      color: colors.danger,
      description: 'Access question papers from past exams organized by college.',
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
    } else if (itemId === 'pyq-hub') {
      router.push('/pyq-hub');
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

            <View className="gap-0">
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
