import { useRouter } from 'expo-router';
import { MessageCircle, MessageSquare } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Header, HeaderCard, MenuCard } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

// Desktop feedback card component
function DesktopFeedbackCard({
  title,
  description,
  onPress,
  colors,
}: {
  title: string;
  description: string;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }: any) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 18,
        backgroundColor: colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        cursor: 'pointer',
        transform: [{ scale: pressed ? 0.99 : 1 }],
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        flex: 1,
      })}
      accessibilityRole="button"
    >
      <View
        className="w-11 h-11 rounded-xl items-center justify-center shrink-0"
        style={{
          backgroundColor: colors.cobalt[500] + '18',
        }}
      >
        <MessageSquare size={22} color={colors.cobalt[500]} strokeWidth={1.75} />
      </View>
      <View className="flex-1">
        <Text
          style={{ color: colors.text }}
          className="text-[15px] mb-[3px] font-sans-semi"
        >
          {title}
        </Text>
        <Text
          style={{ color: colors.textSecondary }}
          className="text-xs leading-[17px] font-sans"
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

export default function FeedbackHome() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();

  if (isDesktopWeb) {
    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={900}>
            <Header title="Feedback" showBackButton fallbackRoute="/(tabs)" />

            <View className="flex-row items-start gap-5">
              <DesktopFeedbackCard
                title="Faculty Feedback"
                description="Rate and provide feedback for your faculty members."
                onPress={() => router.push('/feedback/faculty')}
                colors={colors}
              />
            </View>
          </ContentContainer>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <Header title="Feedback" showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-2">
          <HeaderCard
            variant="hero"
            title="Student Feedback"
            description="Share your feedback on faculty and courses"
            icon={MessageCircle}
          />

          <MenuCard
            title="Faculty Feedback"
            description="Rate and provide feedback for your faculty"
            icon={MessageCircle}
            iconColor={colors.danger}
            onPress={() => router.push('/feedback/faculty')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
