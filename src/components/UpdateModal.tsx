import { AppInfo } from "@/src/api/appInfo";
import { Button } from "@/src/components/Button";
import { Text } from "@/src/components/Themed";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { UpdateType } from "@/src/utils/versionHelpers";
import { ArrowRight, Bug, Rocket, Sparkles } from "lucide-react-native";
import React from "react";
import { Linking, Modal, ScrollView, StyleSheet, View } from "react-native";

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
          iconColor: colors.accent,
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
      onRequestClose={canDismiss ? onDismiss : undefined}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Icon */}
            <View style={styles.iconWrapper}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: iconColor + "20" },
                ]}
              >
                <Icon size={40} color={iconColor} strokeWidth={1.5} />
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

            {/* Message */}
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {getMessage()}
            </Text>

            {/* Version Info */}
            <View
              style={[
                styles.versionRow,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <View style={styles.versionItem}>
                <Text
                  style={[styles.versionLabel, { color: colors.textMuted }]}
                >
                  Current
                </Text>
                <Text style={[styles.versionValue, { color: colors.text }]}>
                  {currentVersion}
                </Text>
              </View>

              <ArrowRight
                size={20}
                color={colors.textMuted}
                strokeWidth={1.5}
                style={styles.arrowIcon}
              />

              <View style={styles.versionItem}>
                <Text
                  style={[styles.versionLabel, { color: colors.textMuted }]}
                >
                  Latest
                </Text>
                <Text style={[styles.versionValue, { color: colors.primary }]}>
                  v{appInfo.version}
                </Text>
              </View>
            </View>

            {/* Release Notes */}
            {appInfo.releaseNotes && (
              <View style={styles.releaseNotesContainer}>
                <Text
                  style={[styles.releaseNotesTitle, { color: colors.text }]}
                >
                  What's New
                </Text>
                <Text
                  style={[styles.releaseNotes, { color: colors.textSecondary }]}
                >
                  {appInfo.releaseNotes}
                </Text>
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {updateType === "major" ? (
                <Button
                  title="Update Now"
                  onPress={handleOpenStore}
                  variant="primary"
                  fullWidth
                />
              ) : (
                <>
                  <Button
                    title="Update Now"
                    onPress={handleOpenStore}
                    variant="primary"
                    fullWidth
                  />
                  <View style={styles.buttonSpacer} />
                  <Button
                    title="Maybe Later"
                    onPress={onDismiss}
                    variant="secondary"
                    fullWidth
                    style={{ backgroundColor: "transparent" }}
                    textStyle={{ color: colors.textSecondary }}
                  />
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    width: "100%",
  },
  versionItem: {
    alignItems: "center",
  },
  versionLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  versionValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  arrowIcon: {
    marginHorizontal: 20,
  },
  releaseNotesContainer: {
    width: "100%",
    marginBottom: 24,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
  },
  releaseNotesTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  releaseNotes: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
  },
  buttonSpacer: {
    height: 12,
  },
});
