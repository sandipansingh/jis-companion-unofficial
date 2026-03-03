import { ArrowRight, Bug, Rocket, Sparkles } from 'lucide-react-native';
import React from 'react';
import { Linking, Modal, ScrollView, View } from 'react-native';

import { AppInfo } from '@/src/api/appInfo';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useAlertStore } from '@/src/store/alertStore';
import { UpdateType } from '@/src/utils/versionHelpers';

import { Button } from './Button';
import { Text } from './Themed';

interface UpdateModalProps {
  visible: boolean;
  updateType: UpdateType;
  currentVersion: string;
  appInfo: AppInfo;
  onDismiss: () => void;
}

export function UpdateModal({
  visible,
  updateType,
  currentVersion,
  appInfo,
  onDismiss,
}: UpdateModalProps) {
  const { colors } = useTheme();
  const { showAlert } = useAlertStore();

  const handleOpenStore = async () => {
    try {
      const canOpen = await Linking.canOpenURL(appInfo.url);
      if (canOpen) {
        await Linking.openURL(appInfo.url);
      } else {
        showAlert({
          title: 'Error',
          message: 'Unable to open Play Store',
        });
      }
    } catch {
      showAlert({
        title: 'Error',
        message: 'Unable to open Play Store',
      });
    }
  };

  const getHeaderAttributes = () => {
    switch (updateType) {
      case 'major':
        return {
          Icon: Rocket,
          iconColor: colors.primary,
          title: 'Critical Update',
        };
      case 'minor':
        return {
          Icon: Sparkles,
          iconColor: colors.primary,
          title: 'New Features!',
        };
      case 'patch':
      default:
        return {
          Icon: Bug,
          iconColor: colors.success,
          title: 'Bug Fixes & Polish',
        };
    }
  };

  const getMessage = () => {
    switch (updateType) {
      case 'major':
        return "Ideally, we wouldn't force this, but this update includes critical changes required for the app to function properly.";
      case 'minor':
        return "We've added some cool new features! Update now to verify them out.";
      case 'patch':
        return "We've squashed some bugs and improved performance.";
      default:
        return 'A new version is available.';
    }
  };

  const { Icon, iconColor, title } = getHeaderAttributes();
  const canDismiss = updateType !== 'major';

  // Dynamic classes based on update type
  const iconBgClass =
    updateType === 'patch' ? 'bg-success/[0.125]' : 'bg-primary/[0.125]';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={canDismiss ? onDismiss : undefined}
    >
      <View className="flex-1 bg-black/60 justify-center items-center p-6">
        <View className="w-full max-w-[400px] max-h-[85%] rounded-[24px] bg-surface shadow-lg shadow-black/20 elevation-10">
          <ScrollView
            contentContainerClassName="p-6 items-center"
            showsVerticalScrollIndicator={true}
          >
            <View className="mb-5">
              <View
                className={`w-20 h-20 rounded-full justify-center items-center ${iconBgClass}`}
              >
                <Icon size={40} color={iconColor} strokeWidth={1.5} />
              </View>
            </View>

            <Text className="text-2xl font-bold text-center mb-3 font-display-bold text-text">
              {title}
            </Text>

            <Text className="text-base text-center mb-6 leading-6 px-2 font-sans text-ink-700 dark:text-ink-400">
              {getMessage()}
            </Text>

            <View className="flex-row items-center justify-between w-full py-3 px-6 rounded-2xl mb-6 bg-text/6">
              <View className="items-center flex-1">
                <Text className="text-xs mb-1 font-semibold uppercase tracking-wider font-sans-md text-ink-500">
                  Current
                </Text>
                <Text className="text-base font-bold font-display text-text">
                  {currentVersion}
                </Text>
              </View>

              <ArrowRight
                size={20}
                color={colors.textSecondary}
                strokeWidth={1.5}
                className="mx-5 opacity-50"
              />

              <View className="items-center flex-1">
                <Text className="text-xs mb-1 font-semibold uppercase tracking-wider font-sans-md text-ink-500">
                  Latest
                </Text>
                <Text className="text-base font-bold font-display text-primary">
                  v{appInfo.version}
                </Text>
              </View>
            </View>

            {appInfo.releaseNotes && (
              <View className="w-full mb-6 p-4 rounded-xl bg-text/6">
                <Text className="text-sm font-sans-semi mb-2 uppercase text-text">
                  What's New
                </Text>
                <Text className="text-sm leading-5 font-sans text-ink-700 dark:text-ink-400">
                  {appInfo.releaseNotes
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/p>/gi, '\n\n')
                    .replace(/<p>/gi, '')
                    .replace(/<\/?strong>/gi, '')
                    .replace(/<\/?b>/gi, '')
                    .replace(/<\/?em>/gi, '')
                    .replace(/<\/?i>/gi, '')
                    .replace(/&nbsp;/gi, ' ')
                    .replace(/&amp;/gi, '&')
                    .replace(/&lt;/gi, '<')
                    .replace(/&gt;/gi, '>')
                    .replace(/&quot;/gi, '"')
                    .trim()}
                </Text>
              </View>
            )}

            <View className="w-full gap-3">
              <Button
                title="Update Now"
                onPress={handleOpenStore}
                variant="primary"
                className="h-[50px] rounded-xl"
                textClassName="text-base"
              />

              {updateType !== 'major' && (
                <Button
                  title="Maybe Later"
                  onPress={onDismiss}
                  variant="secondary"
                  className="h-[50px] rounded-xl border-0 bg-transparent"
                  textClassName="text-base text-ink-700 dark:text-ink-400"
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
