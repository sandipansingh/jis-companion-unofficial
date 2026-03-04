import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { Header, HeaderCard, MenuCard } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

export default function FeedbackHome() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();

  return (
    <View className="flex-1 bg-base">
      {!isDesktopWeb && <Header title="Feedback" showBackButton />}
      <ScrollView
        className="flex-1"
        contentContainerStyle={
          isDesktopWeb ? { paddingHorizontal: 32, paddingBottom: 80 } : undefined
        }
        showsVerticalScrollIndicator={false}
      >
        <ContentContainer maxWidth={900}>
          {isDesktopWeb && (
            <Header title="Feedback" showBackButton fallbackRoute="/(tabs)" />
          )}
          <View className={isDesktopWeb ? undefined : 'px-5 pt-6 pb-2'}>
            {!isDesktopWeb && (
              <HeaderCard
                variant="hero"
                title="Student Feedback"
                description="Share your feedback on faculty and courses"
                icon={MessageCircle}
              />
            )}
            <MenuCard
              title="Faculty Feedback"
              description="Rate and provide feedback for your faculty members."
              icon={MessageCircle}
              iconColor={colors.cta}
              onPress={() => router.push('/feedback/faculty')}
            />
          </View>
        </ContentContainer>
      </ScrollView>
    </View>
  );
}
