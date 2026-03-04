import { router, usePathname } from 'expo-router';
import {
  BookOpen,
  CreditCard,
  Home,
  LogOut,
  LucideIcon,
  ScrollText,
  ShieldCheck,
  SmartphoneNfc,
  User,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { getAppInfo } from '@/src/api/appInfo';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useAuthStore } from '@/src/features/auth/store';

interface NavItem {
  label: string;
  icon: LucideIcon;
  /** expo-router href */
  href: string;
  /** Last path segment — used for active detection */
  routeName: string;
}

const PRIMARY_NAV: NavItem[] = [
  {
    label: 'Home',
    icon: Home,
    href: '/(tabs)',
    routeName: 'index',
  },
  {
    label: 'Academics',
    icon: BookOpen,
    href: '/(tabs)/academics',
    routeName: 'academics',
  },
  {
    label: 'Fees',
    icon: CreditCard,
    href: '/(tabs)/fees',
    routeName: 'fees',
  },
  {
    label: 'Profile',
    icon: User,
    href: '/(tabs)/profile',
    routeName: 'profile',
  },
];

function isNavItemActive(routeName: string, pathname: string): boolean {
  if (routeName === 'index') {
    return (
      pathname === '/' || pathname === '/(tabs)' || /^\/(\(tabs\))?\/?$/.test(pathname)
    );
  }
  return pathname.endsWith(`/${routeName}`) || pathname.includes(`/${routeName}/`);
}

interface NavRowProps {
  item: NavItem;
  isActive: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
}

function NavRow({ item, isActive, colors, isDark }: NavRowProps) {
  const Icon = item.icon;

  return (
    <Pressable
      onPress={() => router.push(item.href as any)}
      className={`flex-row items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-slate-400/30 dark:bg-white/[0.12]'
          : 'hover:bg-black/5 active:bg-black/5 dark:hover:bg-white/5 dark:active:bg-white/5'
      }`}
      accessibilityRole="link"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isActive }}
    >
      <Icon
        size={20}
        color={isActive ? (isDark ? '#E2E8F0' : '#1E2235') : colors.textSecondary}
        strokeWidth={isActive ? 2 : 1.5}
      />
      <Text
        className={`text-sm font-sans-md leading-5 ${
          isActive
            ? 'text-[#1E2235] dark:text-[#E2E8F0] font-sans-semi'
            : 'text-ink-700 dark:text-ink-400'
        }`}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

/**
 * Desktop-only left sidebar navigation.

 *
 * Rendered only by `DesktopShell` when `isDesktopWeb === true`.
 * Never rendered on native or narrow web — so it does not affect
 * mobile styles in any way.
 */
export function DesktopSidebar() {
  const { colors, isDark } = useTheme();
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const [playStoreUrl, setPlayStoreUrl] = useState<string | null>(null);

  useEffect(() => {
    getAppInfo()
      .then((info) => setPlayStoreUrl(info.url))
      .catch(() => {
        /* silently ignore */
      });
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="w-[240px] border-r border-border bg-surface pt-8 pb-6 px-4 flex-col justify-between web:min-h-screen">
      <View>
        <View className="px-3 mb-8">
          <Text className="text-base font-sans-bold text-text leading-[22px]">
            JIS Companion
          </Text>
          <Text className="text-[11px] font-sans text-ink-700 dark:text-ink-400 mt-0.5 tracking-[0.4px] uppercase">
            Unofficial
          </Text>
        </View>

        <Text className="text-[10px] font-sans-semi text-ink-500 tracking-[0.8px] uppercase px-3 mb-1.5">
          Navigation
        </Text>

        <View className="gap-0.5">
          {PRIMARY_NAV.map((item) => (
            <NavRow
              key={item.routeName}
              item={item}
              isActive={isNavItemActive(item.routeName, pathname)}
              colors={colors}
              isDark={isDark}
            />
          ))}
        </View>
      </View>

      <View className="border-t border-border pt-4 gap-0.5">
        <Text className="text-[10px] font-sans-semi text-ink-500 tracking-[0.8px] uppercase px-3 mb-1">
          More
        </Text>

        {[
          { label: 'Privacy Policy', href: '/legal/privacy', icon: ShieldCheck },
          { label: 'Terms of Service', href: '/legal/terms', icon: ScrollText },
          ...(playStoreUrl
            ? [
                {
                  label: 'Get on Play Store',
                  href: playStoreUrl,
                  icon: SmartphoneNfc,
                  isExternal: true,
                },
              ]
            : []),
        ].map((item) => (
          <Pressable
            key={item.label}
            onPress={() =>
              item.isExternal ? Linking.openURL(item.href) : router.push(item.href as any)
            }
            className="flex-row items-center gap-3 px-3 py-[9px] rounded-xl cursor-pointer hover:bg-black/5 active:bg-black/5 dark:hover:bg-white/5 dark:active:bg-white/5 disabled:opacity-50"
            accessibilityRole="link"
            accessibilityLabel={item.label}
          >
            <item.icon size={18} color={colors.textSecondary} strokeWidth={1.5} />
            <Text className="text-[13px] font-sans-md text-ink-700 dark:text-ink-400 leading-5">
              {item.label}
            </Text>
          </Pressable>
        ))}

        <View className="h-px bg-border my-2" />

        <Pressable
          onPress={handleLogout}
          className="flex-row items-center gap-2.5 px-3.5 py-[11px] rounded-xl border border-border bg-surface cursor-pointer hover:bg-black/5 active:bg-black/5 dark:hover:bg-white/5 dark:active:bg-white/5 transition-colors duration-150"
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <LogOut size={18} color={colors.textSecondary} strokeWidth={1.75} />
          <Text className="text-sm font-sans-md text-ink-700 dark:text-ink-400 leading-5">
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
