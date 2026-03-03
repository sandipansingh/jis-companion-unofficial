import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { securityImage } from '@/src/constants/images';
import { legal } from '@/src/constants/legal';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

import { CreditsButton, DemoLoginButton, LoginForm, LoginLogo } from '../components';
import { useLoginData } from '../hooks';

export default function Login() {
  const {
    studentId,
    password,
    loading,
    setStudentId,
    setPassword,
    handleLogin,
    showCredits,
    handleDemoLogin,
  } = useLoginData();

  const { isDesktopWeb } = useBreakpoint();
  const { isDark } = useTheme();

  if (isDesktopWeb) {
    const leftGradient = isDark
      ? 'linear-gradient(145deg, #1C2128 0%, #161B22 100%)'
      : 'linear-gradient(145deg, #f0f4fe 0%, #e8edf7 100%)';

    return (
      <View className="flex-1 bg-base">
        <View className="flex-1 flex-row">
          <View
            className="justify-center items-center relative py-16 px-14"
            style={{ flex: 55, background: leftGradient } as any}
          >
            <View className="absolute top-0 bottom-0 right-0 w-px bg-border" />

            <View className="w-full max-w-[560px]">
              <Image
                source={securityImage}
                style={{ width: 64, height: 64, marginBottom: 28 }}
                resizeMode="contain"
                accessible={false}
              />

              <Text className="text-[44px] font-display-bold text-text tracking-tight leading-[52px] mb-2">
                Companion
              </Text>
              <Text className="text-lg text-ink-600 dark:text-ink-300 tracking-tight mb-5">
                Your student dashboard
              </Text>
              <Text className="text-[15px] text-ink-600 dark:text-ink-400 leading-relaxed max-w-[480px] mb-8">
                Everything you need for your academic life — attendance, results, library,
                fees, and more — organised in one place.
              </Text>
              <Text className="text-[11px] text-ink-400 dark:text-ink-500 tracking-widest">
                JIS Companion · Unofficial student companion app
              </Text>
            </View>
          </View>

          <View className="justify-center bg-base" style={{ flex: 45 }}>
            <ScrollView
              contentContainerClassName="grow justify-center items-center py-12 px-10"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View
                className="w-full max-w-[440px] rounded-3xl border border-border p-10 bg-surface"
                style={{
                  boxShadow: isDark
                    ? '0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)'
                    : '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <LoginForm
                  studentId={studentId}
                  password={password}
                  loading={loading}
                  onStudentIdChange={setStudentId}
                  onPasswordChange={setPassword}
                  onSubmit={handleLogin}
                />

                <DemoLoginButton onPress={handleDemoLogin} />
                <Text className="mt-5 text-center text-[11px] text-ink-400 dark:text-ink-500 leading-relaxed font-sans">
                  By signing in, you agree to our{' '}
                  <Text
                    className="text-[11px] text-ink-500 dark:text-ink-400 underline font-sans"
                    onPress={() => Linking.openURL(legal.privacy)}
                  >
                    Privacy Policy
                  </Text>{' '}
                  and{' '}
                  <Text
                    className="text-[11px] text-ink-500 dark:text-ink-400 underline font-sans"
                    onPress={() => Linking.openURL(legal.terms)}
                  >
                    Terms of Service
                  </Text>
                  .
                </Text>
                <View className="mt-3 items-center">
                  <CreditsButton onPress={showCredits} />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerClassName="grow px-6 pb-10 justify-between"
          bounces
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <LoginLogo />
            <LoginForm
              studentId={studentId}
              password={password}
              loading={loading}
              onStudentIdChange={setStudentId}
              onPasswordChange={setPassword}
              onSubmit={handleLogin}
            />

            <DemoLoginButton onPress={handleDemoLogin} />
            <Text className="mt-5 text-center text-[11px] text-ink-400 dark:text-ink-500 leading-relaxed font-sans">
              By signing in, you agree to our{' '}
              <Text
                className="text-[11px] text-ink-500 dark:text-ink-400 underline font-sans"
                onPress={() => Linking.openURL(legal.privacy)}
              >
                Privacy Policy
              </Text>{' '}
              and{' '}
              <Text
                className="text-[11px] text-ink-500 dark:text-ink-400 underline font-sans"
                onPress={() => Linking.openURL(legal.terms)}
              >
                Terms of Service
              </Text>
              .
            </Text>
          </View>

          <CreditsButton onPress={showCredits} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
