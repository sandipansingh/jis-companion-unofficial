import { AppInfo } from "@/src/api/appInfo";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { UpdateType } from "@/src/utils/versionHelpers";
import { ArrowRight, Bug, Rocket, Sparkles } from "lucide-react-native";
import React from "react";
import { Linking, Modal, ScrollView, View } from "react-native";
import { Button } from "./Button";
import { Text } from "./Themed";

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
          title: "Error",
          message: "Unable to open Play Store",
        });
      }
    } catch (error) {
      showAlert({
        title: "Error",
        message: "Unable to open Play Store",
      });
    }
  };

  const getHeaderAttributes = () => {
    switch (updateType) {
      case "major":
        return {
          Icon: Rocket,
          iconColor: colors.primary,
          title: "Critical Update",
        };
      case "minor":
        return {
          Icon: Sparkles,
          iconColor: colors.primary,
          title: "New Features!",
        };
      case "patch":
      default:
        return {
          Icon: Bug,
          iconColor: colors.success,
          title: "Bug Fixes & Polish",
        };
    }
  };

  const getMessage = () => {
    switch (updateType) {
      case "major":
        return "Ideally, we wouldn't force this, but this update includes critical changes required for the app to function properly.";
      case "minor":
        return "We've added some cool new features! Update now to verify them out.";
      case "patch":
        return "We've squashed some bugs and improved performance.";
      default:
        return "A new version is available.";
    }
  };

  const { Icon, iconColor, title } = getHeaderAttributes();
  const canDismiss = updateType !== "major";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={canDismiss ? onDismiss : undefined}
    >
      <View className="flex-1 bg-black/60 justify-center items-center p-6">
        <View
          className="w-full max-w-[400px] max-h-[85%] rounded-[24px]"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 24, alignItems: "center" }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Icon */}
            <View className="mb-5">
              <View
                className="w-20 h-20 rounded-full justify-center items-center"
                style={{ backgroundColor: iconColor + "20" }}
              >
                <Icon size={40} color={iconColor} strokeWidth={1.5} />
              </View>
            </View>

            {/* Title */}
            <Text
              className="text-2xl font-bold text-center mb-3 text-ink-950"
              style={{ fontFamily: "ClashDisplay-Bold" }}
            >
              {title}
            </Text>

            {/* Message */}
            <Text
              className="text-base text-center text-ink-600 mb-6 leading-6 px-2"
              style={{ fontFamily: "GeneralSans-Regular" }}
            >
              {getMessage()}
            </Text>

            {/* Version Info */}
            <View
              className="flex-row items-center justify-between w-full py-3 px-6 rounded-2xl mb-6 bg-ink-50/50"
            >
              <View className="items-center flex-1">
                <Text
                  className="text-xs text-ink-500 mb-1 font-semibold uppercase tracking-wider"
                  style={{ fontFamily: "GeneralSans-Medium" }}
                >
                  Current
                </Text>
                <Text
                  className="text-base font-bold text-ink-950"
                  style={{ fontFamily: "ClashDisplay-Semibold" }}
                >
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
                <Text
                  className="text-xs text-ink-500 mb-1 font-semibold uppercase tracking-wider"
                  style={{ fontFamily: "GeneralSans-Medium" }}
                >
                  Latest
                </Text>
                <Text
                  className="text-base font-bold"
                  style={{ fontFamily: "ClashDisplay-Semibold", color: colors.primary }}
                >
                  v{appInfo.version}
                </Text>
              </View>
            </View>

            {/* Release Notes */}
            {appInfo.releaseNotes && (
              <View className="w-full mb-6 p-4 bg-ink-50/50 rounded-xl">
                <Text
                  className="text-sm font-bold mb-2 uppercase text-ink-950"
                  style={{ fontFamily: "GeneralSans-Semibold" }}
                >
                  What's New
                </Text>
                <Text
                  className="text-sm leading-5 text-ink-600"
                  style={{ fontFamily: "GeneralSans-Regular" }}
                >
                  {appInfo.releaseNotes
                    .replace(/<br\s*\/?>/gi, "\n")
                    .replace(/<\/p>/gi, "\n\n")
                    .replace(/<p>/gi, "")
                    .replace(/<\/?strong>/gi, "")
                    .replace(/<\/?b>/gi, "")
                    .replace(/<\/?em>/gi, "")
                    .replace(/<\/?i>/gi, "")
                    .replace(/&nbsp;/gi, " ")
                    .replace(/&amp;/gi, "&")
                    .replace(/&lt;/gi, "<")
                    .replace(/&gt;/gi, ">")
                    .replace(/&quot;/gi, '"')
                    .trim()}
                </Text>
              </View>
            )}

            {/* Buttons */}
            <View className="w-full gap-3">
              <Button
                title="Update Now"
                onPress={handleOpenStore}
                variant="primary"
                style={{ height: 50, borderRadius: 12 }}
                textStyle={{ fontSize: 16 }}
              />

              {updateType !== "major" && (
                <Button
                  title="Maybe Later"
                  onPress={onDismiss}
                  variant="secondary"
                  style={{
                    height: 50,
                    borderRadius: 12,
                    borderWidth: 0,
                    backgroundColor: "transparent",
                  }}
                  textStyle={{
                    fontSize: 16,
                    color: colors.textSecondary,
                  }}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

