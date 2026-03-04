import { Save } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Button, Switch } from '@/src/components';
import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useConnectStore } from '@/src/features/connect/store/connectStore';
import { encryptPayload } from '@/src/features/connect/utils/payload';
import { useSettingsStore } from '@/src/features/settings/store/settingsStore';
import { useDevice } from '@/src/hooks/useDevice';

import { QRPayload, SocialProfile } from '../types';
import { SocialInput } from './SocialInput';

export const MyQRView = React.memo(() => {
  const { isIOS, isWeb } = useDevice();
  const userData = useAuthStore((state) => state.userData);
  const loginData = useAuthStore((state) => state.loginData);
  const studentId = useAuthStore((state) => state.studentId);
  const socialProfile = useConnectStore((state) => state.socialProfile);
  const updateSocialProfile = useConnectStore((state) => state.updateSocialProfile);
  const {
    shareCollege,
    shareContact,
    shareSocial,
    shareProfilePic,
    setShareCollege,
    setShareContact,
    setShareSocial,
    setShareProfilePic,
  } = useSettingsStore();

  const [social, setSocial] = useState<SocialProfile>(() => ({
    github: socialProfile?.github || '',
    linkedin: socialProfile?.linkedin || '',
    x: socialProfile?.x || '',
    discord: socialProfile?.discord || '',
    portfolio: socialProfile?.portfolio || '',
  }));

  const [zoomQR, setZoomQR] = useState(false);

  const handleSaveSocial = () => {
    if (studentId) {
      updateSocialProfile(studentId, social);
    }
  };

  const qrValue = useMemo(() => {
    if (!studentId) return '';

    const payload: QRPayload = {
      studentId,
      fullName: loginData?.student_name || 'Unknown',
      profilePicUrl: (shareProfilePic && userData?.profile_pict_cur_url) || '',
    };

    if (shareCollege) {
      payload.college = {
        name: loginData?.college_name || '',
        branch: loginData?.batch_name || '',
        semester: loginData?.sem_no ? `${loginData.sem_no}th` : '',
      };
    }

    if (shareContact) {
      payload.contact = {
        email:
          userData?.STUDENT_REGISTRATION_DETAIL_sStdEmail ||
          userData?.std_adm_email ||
          '',
        mobileNumber:
          userData?.STUDENT_REGISTRATION_DETAIL_sStdMobile ||
          userData?.std_adm_mobile ||
          '',
      };
    }

    if (shareSocial) {
      payload.social = { ...social };
    }

    return encryptPayload(payload);
  }, [
    studentId,
    loginData?.student_name,
    loginData?.college_name,
    loginData?.batch_name,
    loginData?.sem_no,
    userData?.profile_pict_cur_url,
    userData?.STUDENT_REGISTRATION_DETAIL_sStdEmail,
    userData?.std_adm_email,
    userData?.STUDENT_REGISTRATION_DETAIL_sStdMobile,
    userData?.std_adm_mobile,
    shareCollege,
    shareContact,
    shareSocial,
    shareProfilePic,
    social,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : 'height'}
      className="flex-1"
      keyboardVerticalOffset={isIOS ? 100 : 0}
    >
      <ScrollView
        className="flex-1 p-4"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: isWeb ? 24 : 100 }}
      >
        <View className="items-center mb-8">
          <Pressable
            onLongPress={() => qrValue && setZoomQR(true)}
            delayLongPress={200}
            className="bg-white p-4 rounded-xl shadow-sm active:opacity-90 active:scale-95"
          >
            {qrValue ? (
              <QRCode value={qrValue} size={200} />
            ) : (
              <View className="w-[200px] h-[200px] items-center justify-center">
                <ActivityIndicator size="large" />
              </View>
            )}
          </Pressable>
          <Text className="text-sm text-ink-500 dark:text-ink-400 mt-4 text-center font-sans">
            Scan this QR code to share your profile (Hold to zoom)
          </Text>
        </View>

        <Modal
          visible={zoomQR}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setZoomQR(false)}
        >
          <Pressable
            className="flex-1 bg-black/90 items-center justify-center p-4"
            onPress={() => setZoomQR(false)}
          >
            <Pressable
              className="bg-white dark:bg-surface p-6 rounded-3xl items-center shadow-xl"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="mb-6 bg-white p-4 rounded-xl">
                <QRCode value={qrValue || 'error'} size={280} />
              </View>

              <Text className="text-ink-900 dark:text-white font-display text-lg mb-1">
                {loginData?.student_name || 'Student'}
              </Text>
              <Text className="text-ink-500 dark:text-ink-400 font-sans text-sm">
                {loginData?.college_name || 'Unknown'}
              </Text>
            </Pressable>
          </Pressable>
        </Modal>

        <View className="bg-surface dark:bg-surface rounded-xl p-4 mb-6 border border-border">
          <Text className="text-lg font-semibold text-ink-900 dark:text-white mb-4 font-display">
            Share Settings
          </Text>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-ink-600 dark:text-ink-300 font-medium">
              Share Profile Picture
            </Text>
            <Switch value={shareProfilePic} onValueChange={setShareProfilePic} />
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-ink-600 dark:text-ink-300 font-medium">
              Share College Info
            </Text>
            <Switch value={shareCollege} onValueChange={setShareCollege} />
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-ink-600 dark:text-ink-300 font-medium">
              Share Contact Info
            </Text>
            <Switch value={shareContact} onValueChange={setShareContact} />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-ink-600 dark:text-ink-300 font-medium">
              Share Social Links
            </Text>
            <Switch value={shareSocial} onValueChange={setShareSocial} />
          </View>
        </View>

        <View className="bg-surface dark:bg-surface rounded-xl p-4 mb-8 border border-border">
          <Text className="text-lg font-semibold text-ink-900 dark:text-white mb-4 font-display">
            Social Profiles
          </Text>

          <View className="space-y-4 gap-4">
            <SocialInput
              platform="github"
              label="GitHub Username"
              value={social.github || ''}
              onChange={(v) => setSocial((s) => ({ ...s, github: v }))}
              placeholder="e.g. sandipansingh"
            />

            <SocialInput
              platform="linkedin"
              label="LinkedIn Username"
              value={social.linkedin || ''}
              onChange={(v) => setSocial((s) => ({ ...s, linkedin: v }))}
              placeholder="e.g. sandipansinghdev"
            />

            <SocialInput
              platform="x"
              label="X (Twitter) Username"
              value={social.x || ''}
              onChange={(v) => setSocial((s) => ({ ...s, x: v }))}
              placeholder="e.g. sandipannnnn"
            />

            <SocialInput
              platform="discord"
              label="Discord Username"
              value={social.discord || ''}
              onChange={(v) => setSocial((s) => ({ ...s, discord: v }))}
              placeholder="e.g. sandipansingh"
            />

            <SocialInput
              platform="portfolio"
              label="Portfolio URL"
              value={social.portfolio || ''}
              onChange={(v) => setSocial((s) => ({ ...s, portfolio: v }))}
              placeholder="e.g. https://sandipansingh.com"
            />

            <Button
              title="Save Changes"
              onPress={handleSaveSocial}
              icon={<Save size={20} color="white" />}
              className="mt-4"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});
