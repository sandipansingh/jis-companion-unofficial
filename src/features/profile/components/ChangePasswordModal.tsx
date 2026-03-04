import { Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Text, TouchableOpacity, View } from 'react-native';

import { Button, TextInput } from '@/src/components';
import { useTheme } from '@/src/contexts/ThemeContext';
import { device } from '@/src/hooks/useDevice';
import { useAlertStore } from '@/src/store/alertStore';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string, currentPassword?: string) => Promise<void>;
}

export default function ChangePasswordModal({
  visible,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const { showAlert } = useAlertStore();
  const { colors } = useTheme();
  const isWeb = device.isWeb;

  const validatePasswords = (): boolean => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (isWeb && !currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validatePasswords()) return;

    setIsLoading(true);
    try {
      await onSubmit(newPassword, isWeb ? currentPassword : undefined);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      onClose();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to change password';
      showAlert({
        title: 'Error',
        message: `${errorMessage}\n\nPlease try logging out of other phone and web, then try again after 15 minutes.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={device.isIOS ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center px-5 bg-black/50"
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-[500px]"
          >
            <View
              className="w-full bg-surface rounded-2xl p-6 mb-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text className="text-xl text-ink-900 dark:text-white mb-6 font-display">
                Change Password
              </Text>

              {isWeb && (
                <View className="mb-5">
                  <Text className="text-sm text-ink-500 mb-2 font-sans-semi">
                    Current Password
                  </Text>
                  <TextInput
                    icon={Lock}
                    iconColor={colors.cta}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChangeText={(text) => {
                      setCurrentPassword(text);
                      setErrors({ ...errors, currentPassword: undefined });
                    }}
                    isPassword
                    autoCapitalize="none"
                    editable={!isLoading}
                    disableFocusStyle
                  />
                  {errors.currentPassword && (
                    <Text className="text-xs text-danger mt-1 ml-1 font-sans">
                      {errors.currentPassword}
                    </Text>
                  )}
                </View>
              )}

              <View className="mb-5">
                <Text className="text-sm text-ink-500 mb-2 font-sans-semi">
                  New Password
                </Text>
                <TextInput
                  icon={Lock}
                  iconColor={colors.cta}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setErrors({ ...errors, newPassword: undefined });
                  }}
                  isPassword
                  showPasswordToggle={false}
                  autoCapitalize="none"
                  editable={!isLoading}
                  disableFocusStyle
                />
                {errors.newPassword && (
                  <Text className="text-xs text-danger mt-1 ml-1 font-sans">
                    {errors.newPassword}
                  </Text>
                )}
              </View>

              <View className="mb-5">
                <Text className="text-sm text-ink-500 mb-2 font-sans-semi">
                  Confirm New Password
                </Text>
                <TextInput
                  icon={Lock}
                  iconColor={colors.cta}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  isPassword
                  autoCapitalize="none"
                  editable={!isLoading}
                  disableFocusStyle
                />
                {errors.confirmPassword && (
                  <Text className="text-xs text-danger mt-1 ml-1 font-sans">
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>

              <Button
                title="Change Password"
                onPress={handleSubmit}
                disabled={isLoading}
                loading={isLoading}
                style={{ marginTop: 4 }}
              />
              <Button
                title="Cancel"
                variant="secondary"
                onPress={handleClose}
                disabled={isLoading}
                style={{ marginTop: 12, height: 50 }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
