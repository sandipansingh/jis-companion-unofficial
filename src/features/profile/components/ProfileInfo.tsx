import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

import { RegistrationRollInfo } from './RegistrationRollInfo';

interface ProfileInfoProps {
  profileImageUrl?: string;
  name?: string;
  studentId?: string;
  semester?: string | number;
  registrationNo?: string;
  rollNo?: string;
  getInitials: (name: string) => string;
}

export function ProfileInfo({
  profileImageUrl,
  name,
  studentId,
  semester,
  registrationNo,
  rollNo,
  getInitials,
}: ProfileInfoProps) {
  const { colors } = useTheme();
  return (
    <View className="items-center pt-6 pb-4">
      {profileImageUrl ? (
        <Image
          source={{ uri: profileImageUrl }}
          contentFit="cover"
          style={{
            width: 112,
            height: 112,
            borderRadius: 16,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: colors.border,
          }}
        />
      ) : (
        <View className="w-28 h-28 rounded-2xl mb-4 bg-cobalt-500 items-center justify-center border-2 border-border">
          <Text className="text-4xl text-white font-display-bold">
            {getInitials(name || 'Student')}
          </Text>
        </View>
      )}

      <Text className="text-2xl text-ink-900 dark:text-ink-100 uppercase tracking-wide mb-2 font-display">
        {name || 'Student'}
      </Text>

      <View className="flex-row items-center gap-2">
        {studentId && (
          <Text className="text-sm text-cobalt-600 dark:text-cobalt-400 font-sans-semi">
            {studentId}
          </Text>
        )}
        {studentId && semester && <View className="w-1 h-1 rounded-full bg-ink-400" />}
        {semester && (
          <View className="bg-cobalt-50 dark:bg-cobalt-900/30 rounded-full px-2.5 py-0.5 border border-cobalt-100 dark:border-cobalt-800/50">
            <Text className="text-[11px] text-cobalt-600 dark:text-cobalt-300 font-sans-md">
              Semester {semester}
            </Text>
          </View>
        )}
      </View>

      <RegistrationRollInfo registrationNo={registrationNo} rollNo={rollNo} />
    </View>
  );
}
