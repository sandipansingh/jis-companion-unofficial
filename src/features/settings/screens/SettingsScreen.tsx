import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  Moon,
  Shield,
  Sun,
} from 'lucide-react-native';
import { Linking, ScrollView, TouchableOpacity } from 'react-native';

import { Header, Switch, Text, View } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { legal } from '@/src/constants/legal';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

import { SettingsRow, SettingsSection } from '../components';
import { useSettingsStore } from '../store/settingsStore';

export default function SettingsScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const feesViewMode = useSettingsStore((s) => s.feesViewMode);
  const setFeesViewMode = useSettingsStore((s) => s.setFeesViewMode);
  const isSimplifiedFees = feesViewMode === 'simplified';

  return (
    <View className="flex-1 bg-base">
      {isDesktopWeb ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={900}>
            <Header title="Settings" showBackButton fallbackRoute="/(tabs)" />

            <SettingsSection
              title="Appearance"
              rows={[
                <SettingsRow
                  key="theme"
                  label="Dark Mode"
                  description={
                    isDark
                      ? 'Using dark theme. Note: currently in beta.'
                      : 'Using light theme. Dark mode is currently in beta.'
                  }
                  isFirst
                  isLast
                  control={
                    <View className="flex-row items-center gap-2.5">
                      {isDark ? (
                        <Moon size={16} color={colors.cta} />
                      ) : (
                        <Sun size={16} color={colors.cta} />
                      )}
                      <Switch value={isDark} onValueChange={toggleTheme} />
                    </View>
                  }
                />,
              ]}
            />

            <SettingsSection
              title="Fees"
              rows={[
                <SettingsRow
                  key="fees-view"
                  label="Simplified Fees View"
                  description={
                    isSimplifiedFees
                      ? 'Showing simplified student-friendly summary.'
                      : 'Showing official college ledger format.'
                  }
                  isFirst
                  isLast
                  control={
                    <View className="flex-row items-center gap-2.5">
                      <LayoutDashboard
                        size={16}
                        color={isSimplifiedFees ? colors.cta : colors.textTertiary}
                      />
                      <Switch
                        value={isSimplifiedFees}
                        onValueChange={(v) =>
                          setFeesViewMode(v ? 'simplified' : 'college')
                        }
                      />
                    </View>
                  }
                />,
              ]}
            />
          </ContentContainer>
        </ScrollView>
      ) : (
        <>
          <Header title="Settings" showBackButton />

          <ScrollView contentContainerClassName="p-4">
            <View className="mb-6">
              <Text className="text-xs font-medium mb-2 ml-1 tracking-wider text-ink-500 dark:text-ink-400 font-sans">
                APPEARANCE
              </Text>

              <View className="bg-surface dark:bg-surface rounded-2xl overflow-hidden p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View
                      className="w-9 h-9 rounded-[10px] justify-center items-center mr-3"
                      style={{ backgroundColor: colors.ctaSoft }}
                    >
                      {isDark ? (
                        <Moon size={20} color={colors.cta} />
                      ) : (
                        <Sun size={20} color={colors.cta} />
                      )}
                    </View>
                    <Text className="text-base font-medium text-ink-950 dark:text-ink-100 font-sans">
                      Dark Mode
                    </Text>
                  </View>
                  <Switch value={isDark} onValueChange={toggleTheme} />
                </View>
                <Text className="text-xs text-ink-500 dark:text-ink-400 mt-2 italic">
                  Note: Dark mode is currently in beta. For the best experience, we
                  recommend using light mode.
                </Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xs font-medium mb-2 ml-1 tracking-wider text-ink-500 dark:text-ink-400 font-sans">
                FEES
              </Text>

              <View className="bg-surface dark:bg-surface rounded-2xl overflow-hidden p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 mr-4">
                    <View
                      className="w-9 h-9 rounded-[10px] justify-center items-center mr-3"
                      style={{ backgroundColor: colors.ctaSoft }}
                    >
                      <LayoutDashboard
                        size={20}
                        color={isSimplifiedFees ? colors.cta : colors.textTertiary}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-ink-950 dark:text-ink-100 font-sans">
                        Simplified Fees View
                      </Text>
                      <Text
                        className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 font-sans"
                        numberOfLines={2}
                      >
                        {isSimplifiedFees
                          ? 'Student-friendly summary is the default.'
                          : 'College official ledger is the default.'}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={isSimplifiedFees}
                    onValueChange={(v) => setFeesViewMode(v ? 'simplified' : 'college')}
                  />
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xs font-medium mb-2 ml-1 tracking-wider text-ink-500 dark:text-ink-400 font-sans">
                LEGAL
              </Text>

              <View className="bg-surface dark:bg-surface rounded-2xl overflow-hidden">
                <TouchableOpacity
                  onPress={() => Linking.openURL(legal.privacy)}
                  activeOpacity={0.7}
                  className="flex-row items-center px-4 py-3.5"
                >
                  <View
                    className="w-9 h-9 rounded-[10px] justify-center items-center mr-3"
                    style={{ backgroundColor: colors.ctaSoft }}
                  >
                    <Shield size={18} color={colors.cta} />
                  </View>
                  <Text className="flex-1 text-base font-medium text-ink-950 dark:text-ink-100 font-sans">
                    Privacy Policy
                  </Text>
                  <ExternalLink size={16} color={colors.textTertiary} />
                </TouchableOpacity>

                <View className="h-px bg-border mx-4" />

                <TouchableOpacity
                  onPress={() => Linking.openURL(legal.terms)}
                  activeOpacity={0.7}
                  className="flex-row items-center px-4 py-3.5"
                >
                  <View
                    className="w-9 h-9 rounded-[10px] justify-center items-center mr-3"
                    style={{ backgroundColor: colors.ctaSoft }}
                  >
                    <FileText size={18} color={colors.cta} />
                  </View>
                  <Text className="flex-1 text-base font-medium text-ink-950 dark:text-ink-100 font-sans">
                    Terms of Service
                  </Text>
                  <ExternalLink size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}
