import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import React from "react";
import { Linking, Modal, Text, View } from "react-native";
import { Button } from "./Button";

export function AlertProvider() {
  const { isDark } = useTheme();
  const {
    visible,
    title,
    message,
    confirmText,
    cancelText,
    showCancel,
    isDestructive,
    linkText,
    linkUrl,
    onConfirm,
    onCancel,
    hideAlert,
  } = useAlertStore();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        onCancel?.();
        hideAlert();
      }}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-5">
        <View
          className="w-full max-w-[320px] bg-white dark:bg-ink-900 rounded-2xl p-6 border border-border"
          style={{
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          }}
        >
          <Text
            className="text-lg text-center mb-2 text-ink-950 dark:text-white"
            style={{ fontFamily: "ClashDisplay-Semibold" }}
          >
            {title}
          </Text>
          <Text
            className="text-sm text-center mb-6 text-ink-600 dark:text-ink-300 leading-5"
            style={{ fontFamily: "GeneralSans-Regular" }}
          >
            {message}
          </Text>

          <View className="flex-row gap-3">
            {showCancel && (
              <View className="flex-1">
                <Button
                  title={cancelText || "Cancel"}
                  variant="secondary"
                  onPress={() => {
                    onCancel?.();
                    hideAlert();
                  }}
                  style={{
                    height: 44,
                    borderRadius: 8,
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: isDark ? "#334155" : "#E2E8F0",
                  }}
                  textStyle={{
                    fontSize: 14,
                    color: isDark ? "#94A3B8" : "#64748B",
                    fontFamily: "GeneralSans-Medium",
                  }}
                />
              </View>
            )}

            {linkText && linkUrl && (
              <View className="flex-1">
                <Button
                  title={linkText}
                  variant="secondary"
                  onPress={() => {
                    Linking.openURL(linkUrl);
                    hideAlert();
                  }}
                  style={{
                    height: 44,
                    borderRadius: 8,
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "#2B5BDB",
                  }}
                  textStyle={{
                    fontSize: 14,
                    color: "#2B5BDB",
                    fontFamily: "GeneralSans-Medium",
                  }}
                />
              </View>
            )}

            <View className="flex-1">
              <Button
                title={confirmText || "OK"}
                variant={isDestructive ? "danger" : "primary"}
                onPress={() => {
                  onConfirm?.();
                  hideAlert();
                }}
                style={{
                  height: 44,
                  borderRadius: 8,
                }}
                textStyle={{
                  fontSize: 14,
                  fontFamily: "GeneralSans-Medium",
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
