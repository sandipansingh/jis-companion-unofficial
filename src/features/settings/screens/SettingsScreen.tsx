import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  Moon,
  Shield,
  Sun,
} from 'lucide-react-native';
import { Linking, Platform, Pressable, ScrollView, TouchableOpacity } from 'react-native';

import { Header, Switch, Text, View } from '@/src/components';
import { ContentContainer } from '@/src/components/layout';
import { legal } from '@/src/constants/legal';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

import { useSettingsStore } from '../store/settingsStore';

function DesktopSectionHeader({
  label,
  colors,
}: {
  label: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Text
      className="text-[10px] font-semibold tracking-[0.9px] uppercase mb-1.5 px-0.5 font-sans"
      style={{ color: colors.textTertiary ?? colors.textSecondary }}
    >
      {label}
    </Text>
  );
}

function DesktopSettingsRow({
  label,
  description,
  control,
  isFirst,
  isLast,
  isDark: dark,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  isDark: boolean;
}) {
  return (
    <Pressable
      style={({ hovered }: any) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: hovered
          ? dark
            ? 'rgba(255,255,255,0.03)'
            : 'rgba(0,0,0,0.02)'
          : 'transparent',
        borderTopLeftRadius: isFirst ? 14 : 0,
        borderTopRightRadius: isFirst ? 14 : 0,
        borderBottomLeftRadius: isLast ? 14 : 0,
        borderBottomRightRadius: isLast ? 14 : 0,
        cursor: Platform.OS === 'web' ? ('default' as any) : undefined,
        transition: Platform.OS === 'web' ? 'background-color 150ms ease' : undefined,
      })}
    >
      <View className="flex-1 mr-5">
        <Text className="text-sm font-medium text-text leading-5 font-sans">{label}</Text>
        {description ? (
          <Text className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-[17px] font-sans">
            {description}
          </Text>
        ) : null}
      </View>
      <View className="items-end justify-center">{control}</View>
    </Pressable>
  );
}

function DesktopSettingsSection({
  title,
  rows,
  colors,
}: {
  title: string;
  rows: React.ReactNode[];
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View className="mb-7">
      <DesktopSectionHeader label={title} colors={colors} />
      <View className="rounded-[14px] border border-border overflow-hidden bg-surface">
        {rows.map((row, i) =>
          i < rows.length - 1 ? (
            <View key={i}>
              {row}
              <View className="h-px bg-border mx-4" />
            </View>
          ) : (
            <View key={i}>{row}</View>
          ),
        )}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const feesViewMode = useSettingsStore((s) => s.feesViewMode);
  const setFeesViewMode = useSettingsStore((s) => s.setFeesViewMode);
  const isSimplifiedFees = feesViewMode === 'simplified';

  if (isDesktopWeb) {
    return (
      <View className="flex-1 bg-base">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ContentContainer maxWidth={900}>
            <Header title="Settings" showBackButton fallbackRoute="/(tabs)" />

            <DesktopSettingsSection
              title="Appearance"
              colors={colors}
              rows={[
                <DesktopSettingsRow
                  key="theme"
                  label="Dark Mode"
                  description={
                    isDark
                      ? 'Using dark theme. Note: currently in beta.'
                      : 'Using light theme. Dark mode is currently in beta.'
                  }
                  isFirst
                  isLast
                  isDark={isDark}
                  control={
                    <View className="flex-row items-center gap-2.5">
                      {isDark ? (
                        <Moon size={16} color={colors.primary} />
                      ) : (
                        <Sun size={16} color={colors.primary} />
                      )}
                      <Switch value={isDark} onValueChange={toggleTheme} />
                    </View>
                  }
                />,
              ]}
            />

            <DesktopSettingsSection
              title="Fees"
              colors={colors}
              rows={[
                <DesktopSettingsRow
                  key="fees-view"
                  label="Simplified Fees View"
                  description={
                    isSimplifiedFees
                      ? 'Showing simplified student-friendly summary.'
                      : 'Showing official college ledger format.'
                  }
                  isFirst
                  isLast
                  isDark={isDark}
                  control={
                    <View className="flex-row items-center gap-2.5">
                      <LayoutDashboard
                        size={16}
                        color={isSimplifiedFees ? colors.primary : colors.textTertiary}
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
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base dark:bg-base">
      <Header title="Settings" showBackButton />

      <ScrollView contentContainerClassName="p-4">
        <View className="mb-6">
          <Text className="text-xs font-medium mb-2 ml-1 tracking-wider text-ink-500 dark:text-ink-400 font-sans">
            APPEARANCE
          </Text>

          <View className="bg-surface dark:bg-surface rounded-2xl overflow-hidden p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-[10px] justify-center items-center mr-3 bg-cobalt-50 dark:bg-cobalt-900">
                  {isDark ? (
                    <Moon size={20} color={colors.primary} />
                  ) : (
                    <Sun size={20} color={colors.primary} />
                  )}
                </View>
                <Text className="text-base font-medium text-ink-950 dark:text-ink-100 font-sans">
                  Dark Mode
                </Text>
              </View>
              <Switch value={isDark} onValueChange={toggleTheme} />
            </View>
            <Text className="text-xs text-ink-500 dark:text-ink-400 mt-2 italic">
              Note: Dark mode is currently in beta. For the best experience, we recommend
              using light mode.
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
                <View className="w-9 h-9 rounded-[10px] justify-center items-center mr-3 bg-cobalt-50 dark:bg-cobalt-900">
                  <LayoutDashboard
                    size={20}
                    color={isSimplifiedFees ? colors.primary : colors.textTertiary}
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
              <View className="w-9 h-9 rounded-[10px] justify-center items-center mr-3 bg-cobalt-50 dark:bg-cobalt-900">
                <Shield size={18} color={colors.primary} />
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
              <View className="w-9 h-9 rounded-[10px] justify-center items-center mr-3 bg-cobalt-50 dark:bg-cobalt-900">
                <FileText size={18} color={colors.primary} />
              </View>
              <Text className="flex-1 text-base font-medium text-ink-950 dark:text-ink-100 font-sans">
                Terms of Service
              </Text>
              <ExternalLink size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
