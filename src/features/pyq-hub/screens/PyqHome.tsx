import { useRouter } from 'expo-router';
import { BookMarked, GraduationCap } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { Header, HeaderCard, MenuCard } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

import { COLLEGES } from '../types';

export default function PyqHome() {
  const router = useRouter();
  const { isDesktopWeb } = useBreakpoint();
  const { colors } = useTheme();

  const handleCollegePress = (code: string) => {
    router.push(`/pyq-hub/${code}` as any);
  };

  return (
    <View className="flex-1 bg-base">
      {!isDesktopWeb && <Header title="PYQ Hub" showBackButton />}
      <ScrollView
        className="flex-1"
        contentContainerStyle={
          isDesktopWeb ? { paddingHorizontal: 32, paddingBottom: 80 } : undefined
        }
        showsVerticalScrollIndicator={false}
      >
        <ContentContainer maxWidth={960}>
          {isDesktopWeb && (
            <Header title="PYQ Hub" showBackButton fallbackRoute="/(tabs)" />
          )}
          {!isDesktopWeb && (
            <View className="px-4 pt-5 pb-2">
              <HeaderCard
                variant="hero"
                title="Previous Year Papers"
                description="Access question papers from past exams organized by college"
                icon={BookMarked}
              />
            </View>
          )}
          <View
            className={isDesktopWeb ? 'flex-row flex-wrap gap-3' : 'px-4 pb-6 gap-2.5'}
          >
            {COLLEGES.map((college) => (
              <View
                key={college.code}
                className={isDesktopWeb ? 'w-[calc(50%-6px)]' : undefined}
              >
                <MenuCard
                  title={college.name}
                  description={college.description}
                  icon={GraduationCap}
                  iconColor={colors.cta}
                  onPress={() => handleCollegePress(college.code)}
                  cardClassName="mb-0"
                />
              </View>
            ))}
          </View>
        </ContentContainer>
      </ScrollView>
    </View>
  );
}
