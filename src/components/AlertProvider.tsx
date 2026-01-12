import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";

export function AlertProvider() {
  const { colors } = useTheme();
  const {
    visible,
    title,
    message,
    confirmText,
    cancelText,
    showCancel,
    isDestructive,
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
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {showCancel && (
              <View style={{ flex: 1 }}>
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
                    borderColor: colors.border,
                  }}
                  textStyle={{
                    fontSize: 14,
                    color: colors.text,
                  }}
                />
              </View>
            )}

            <View style={{ flex: 1 }}>
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
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
});
