import { FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import {
  BookOpen,
  Calendar,
  Globe,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
} from 'lucide-react-native';
import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/src/components/Header';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useConnectStore } from '@/src/features/connect/store/connectStore';
import { useAlertStore } from '@/src/store/alertStore';
import { getInitials } from '@/src/utils/stringHelpers';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams();
  const { scannedContacts } = useConnectStore();
  const { showAlert } = useAlertStore();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const contact = scannedContacts.find((c) => c.id === Number(id));

  if (!contact) {
    return (
      <View className="flex-1 items-center justify-center bg-base">
        <Text className="text-lg text-ink-900 dark:text-white font-display">
          Contact not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 rounded-lg"
          style={{ backgroundColor: colors.cta }}
        >
          <Text className="font-sans-semi" style={{ color: colors.onCta }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { payload } = contact;
  const { fullName, college, contact: contactInfo, social, profilePicUrl } = payload;

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    showAlert({
      title: 'Copied!',
      message: `${label} copied to clipboard.`,
    });
  };

  const InfoRow = ({
    icon,
    label,
    value,
    onPress,
    last = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    onPress?: () => void;
    last?: boolean;
  }) => (
    <TouchableOpacity
      className={`flex-row items-center py-3 ${!last && 'border-b border-border'} ${!onPress && 'opacity-100'}`}
      onPress={onPress}
      onLongPress={() => copyToClipboard(value, label)}
      delayLongPress={500}
      disabled={!onPress && !value}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="w-10 h-10 rounded-full bg-surface-highlight items-center justify-center mr-4 bg-slate-100 dark:bg-slate-800">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-xs text-ink-500 dark:text-ink-400 font-sans mb-0.5">
          {label}
        </Text>
        <Text className="text-ink-900 dark:text-white font-sans-md text-base">
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-base">
      <Header title="Profile" showBackButton />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="items-center pt-8 pb-6 px-4 mx-4 mt-6 bg-surface dark:bg-surface rounded-2xl border border-border mb-4 shadow-sm">
          {profilePicUrl ? (
            <Image
              source={{ uri: profilePicUrl }}
              contentFit="cover"
              className="w-28 h-28 rounded-3xl mb-4 border-[3px] border-border"
            />
          ) : (
            <View
              className="w-28 h-28 rounded-3xl mb-4 items-center justify-center border-4 border-white dark:border-slate-800"
              style={{ backgroundColor: colors.ctaSoft }}
            >
              <Text className="font-bold text-4xl" style={{ color: colors.cta }}>
                {getInitials(fullName)}
              </Text>
            </View>
          )}

          <Text className="text-2xl font-bold text-ink-900 dark:text-white font-display text-center mb-1">
            {fullName}
          </Text>
          {college?.name && (
            <View className="flex-row items-center justify-center gap-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mt-3">
              <GraduationCap size={14} color={colors.textSecondary} />
              <Text className="text-ink-500 dark:text-ink-400 font-sans-md text-sm">
                {college.name}
              </Text>
            </View>
          )}
        </View>

        <View className="px-4 gap-4">
          {college && (college.branch || college.semester) && (
            <View className="flex-row gap-3">
              {college.branch && (
                <View className="flex-1 bg-surface dark:bg-surface p-4 rounded-xl border border-border shadow-sm">
                  <BookOpen size={20} color={colors.cta} className="mb-2" />
                  <Text className="text-xs text-ink-500 dark:text-ink-400 font-sans">
                    Branch
                  </Text>
                  <Text
                    className="text-ink-900 dark:text-white font-sans-semi text-sm mt-1"
                    numberOfLines={2}
                  >
                    {college.branch}
                  </Text>
                </View>
              )}
              {college.semester && (
                <View className="flex-1 bg-surface dark:bg-surface p-4 rounded-xl border border-border shadow-sm">
                  <Calendar size={20} color={colors.cta} className="mb-2" />
                  <Text className="text-xs text-ink-500 dark:text-ink-400 font-sans">
                    Semester
                  </Text>
                  <Text
                    className="text-ink-900 dark:text-white font-sans-semi text-sm mt-1"
                    numberOfLines={2}
                  >
                    {college.semester}
                  </Text>
                </View>
              )}
            </View>
          )}

          {contactInfo && (contactInfo.email || contactInfo.mobileNumber) && (
            <View className="bg-surface dark:bg-surface rounded-2xl p-5 border border-border shadow-sm">
              <Text className="text-sm font-sans-bold text-ink-400 uppercase tracking-wider mb-2">
                Contact Details
              </Text>
              {contactInfo.email && (
                <InfoRow
                  icon={<Mail size={20} color={colors.cta} />}
                  label="Email Address"
                  value={contactInfo.email}
                  onPress={() => openUrl(`mailto:${contactInfo.email}`)}
                  last={!contactInfo.mobileNumber}
                />
              )}
              {contactInfo.mobileNumber && (
                <InfoRow
                  icon={<Phone size={20} color={colors.cta} />}
                  label="Phone Number"
                  value={contactInfo.mobileNumber}
                  onPress={() => openUrl(`tel:${contactInfo.mobileNumber}`)}
                  last={true}
                />
              )}
            </View>
          )}

          {social && Object.values(social).some((v) => !!v) && (
            <View className="bg-surface dark:bg-surface rounded-2xl p-5 border border-border shadow-sm">
              <Text className="text-sm font-sans-bold text-ink-400 uppercase tracking-wider mb-2">
                Social Profiles
              </Text>
              {social.linkedin && (
                <InfoRow
                  icon={<FontAwesome6 name="linkedin-in" size={20} color={colors.cta} />}
                  label="LinkedIn"
                  value={social.linkedin}
                  onPress={() => openUrl(`https://linkedin.com/in/${social.linkedin}`)}
                  last={
                    !social.github && !social.x && !social.portfolio && !social.discord
                  }
                />
              )}
              {social.github && (
                <InfoRow
                  icon={<FontAwesome6 name="github" size={20} color={colors.cta} />}
                  label="GitHub"
                  value={social.github}
                  onPress={() => openUrl(`https://github.com/${social.github}`)}
                  last={!social.x && !social.portfolio && !social.discord}
                />
              )}
              {social.x && (
                <InfoRow
                  icon={<FontAwesome6 name="x-twitter" size={20} color={colors.cta} />}
                  label="X (Twitter)"
                  value={social.x}
                  onPress={() => openUrl(`https://x.com/${social.x}`)}
                  last={!social.portfolio && !social.discord}
                />
              )}
              {social.portfolio && (
                <InfoRow
                  icon={<Globe size={20} color={colors.cta} />}
                  label="Portfolio"
                  value={social.portfolio.replace(/^https?:\/\//, '')}
                  onPress={() => social.portfolio && openUrl(social.portfolio)}
                  last={!social.discord}
                />
              )}
              {social.discord && (
                <InfoRow
                  icon={<MessageCircle size={20} color={colors.cta} />}
                  label="Discord"
                  value={social.discord}
                  last={true}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
