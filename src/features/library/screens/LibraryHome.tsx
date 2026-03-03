import { useRouter } from 'expo-router';
import { BookOpen, Search } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Header, HeaderCard, MenuCard } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

interface LibraryNavCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  accent: string;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

function LibraryNavCard({
  title,
  description,
  icon: Icon,
  accent,
  onPress,
  colors,
}: LibraryNavCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 max-w-[420px] flex-row items-center gap-4 p-[18px] bg-surface rounded-[14px] border border-border"
      style={({ pressed }: any) => ({
        cursor: 'pointer' as any,
        transform: [{ scale: pressed ? 0.99 : 1 }],
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      })}
    >
      <View
        className="w-11 h-11 rounded-xl items-center justify-center"
        style={{ backgroundColor: accent + '18' }}
      >
        <Icon size={22} color={accent} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-text mb-0.5 font-sans">
          {title}
        </Text>
        <Text className="text-xs text-ink-500 dark:text-ink-400 leading-[17px] font-sans">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

export default function LibraryHome() {
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
          <ContentContainer maxWidth={1280}>
            <Header title="Library" showBackButton fallbackRoute="/(tabs)" />
            <View className="flex-row flex-wrap gap-5 items-start">
              <LibraryNavCard
                title="My Books"
                description="View and manage your borrowed books, check due dates and return history."
                icon={BookOpen}
                accent={colors.primary}
                onPress={() => router.push('/library/my-books')}
                colors={colors}
              />
              <LibraryNavCard
                title="Search & Reserve"
                description="Find books by title, author, subject or ISBN and reserve them instantly."
                icon={Search}
                accent={colors.success}
                onPress={() => router.push('/library/search-reserve')}
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
      <Header title="Library" showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-2">
          <HeaderCard
            variant="hero"
            title="Library Services"
            description="Manage your borrowed books and discover new titles"
            icon={BookOpen}
          />
          <MenuCard
            title="My Books"
            description="View and manage your borrowed books"
            icon={BookOpen}
            iconColor={colors.primary}
            onPress={() => router.push('/library/my-books')}
          />
          <MenuCard
            title="Search & Reserve"
            description="Find books and reserve them instantly"
            icon={Search}
            iconColor={colors.success}
            onPress={() => router.push('/library/search-reserve')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
