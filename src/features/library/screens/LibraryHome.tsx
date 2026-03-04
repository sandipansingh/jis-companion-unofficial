import { useRouter } from 'expo-router';
import { BookOpen, Search } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { Header, HeaderCard, MenuCard } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

export default function LibraryHome() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();

  return (
    <View className="flex-1 bg-base">
      {!isDesktopWeb && <Header title="Library" showBackButton />}
      <ScrollView
        className="flex-1"
        contentContainerStyle={
          isDesktopWeb ? { paddingHorizontal: 32, paddingBottom: 80 } : undefined
        }
        showsVerticalScrollIndicator={false}
      >
        <ContentContainer maxWidth={1280}>
          {isDesktopWeb && (
            <Header title="Library" showBackButton fallbackRoute="/(tabs)" />
          )}
          <View className={isDesktopWeb ? undefined : 'px-5 pt-6 pb-2'}>
            {!isDesktopWeb && (
              <HeaderCard
                variant="hero"
                title="Library Services"
                description="Manage your borrowed books and discover new titles"
                icon={BookOpen}
              />
            )}
            <View
              className={
                isDesktopWeb ? 'flex-row flex-wrap gap-5 items-start' : undefined
              }
            >
              <MenuCard
                title="My Books"
                description="View and manage your borrowed books, check due dates and return history."
                icon={BookOpen}
                iconColor={colors.cta}
                onPress={() => router.push('/library/my-books')}
                cardClassName={isDesktopWeb ? 'flex-1 max-w-[420px]' : undefined}
              />
              <MenuCard
                title="Search & Reserve"
                description="Find books by title, author, subject or ISBN and reserve them instantly."
                icon={Search}
                iconColor={colors.cta}
                onPress={() => router.push('/library/search-reserve')}
                cardClassName={isDesktopWeb ? 'flex-1 max-w-[420px]' : undefined}
              />
            </View>
          </View>
        </ContentContainer>
      </ScrollView>
    </View>
  );
}
