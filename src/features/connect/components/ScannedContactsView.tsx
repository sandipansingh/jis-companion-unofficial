import { FlashList } from '@shopify/flash-list';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Trash2, User } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useConnectStore } from '@/src/features/connect/store/connectStore';
import { getInitials } from '@/src/utils/stringHelpers';

export const ScannedContactsView = React.memo(() => {
  const scannedContacts = useConnectStore((state) => state.scannedContacts);
  const removeScannedContact = useConnectStore((state) => state.removeScannedContact);
  const studentId = useAuthStore((state) => state.studentId);
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: any }) => {
    const { payload, timestamp, id } = item;
    const { fullName, college, profilePicUrl } = payload;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/connect/${id}`)}
        className="bg-surface dark:bg-surface p-4 rounded-xl mb-3 border border-border flex-row items-center justify-between"
      >
        <View className="flex-row items-center flex-1">
          {profilePicUrl ? (
            <Image
              source={{ uri: profilePicUrl }}
              className="w-12 h-12 rounded-full mr-4"
              contentFit="cover"
            />
          ) : (
            <View className="w-12 h-12 bg-cobalt-500/10 rounded-full items-center justify-center mr-4">
              <Text className="text-cobalt-500 font-bold text-lg">
                {getInitials(fullName)}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-ink-900 dark:text-white font-display">
              {fullName || 'Unknown'}
            </Text>
            {college?.name && (
              <Text
                className="text-sm text-ink-500 dark:text-ink-400 font-sans"
                numberOfLines={1}
              >
                {college.name}
              </Text>
            )}
            <Text className="text-xs text-ink-400 dark:text-ink-500 mt-1 font-sans">
              {format(new Date(timestamp), 'MMM d, yyyy h:mm a')}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (studentId) {
              removeScannedContact(id, studentId);
            }
          }}
          className="p-2"
        >
          <Trash2 size={20} color={colors.danger} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 p-4 bg-base">
      {scannedContacts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <User size={48} color={colors.textSecondary} className="mb-4" />
          <Text className="text-lg font-medium text-ink-900 dark:text-white font-display">
            No contacts yet
          </Text>
          <Text className="text-sm text-ink-500 dark:text-ink-400 text-center mt-2 font-sans">
            Scan someone's QR code to add them to your contacts
          </Text>
        </View>
      ) : (
        <FlashList
          data={scannedContacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={true}
        />
      )}
    </View>
  );
});
