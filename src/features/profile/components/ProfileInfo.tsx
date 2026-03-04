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
        <View
          className="w-28 h-28 rounded-2xl mb-4 items-center justify-center border-2 border-border"
          style={{ backgroundColor: colors.cta }}
        >
          <Text className="text-4xl font-display-bold" style={{ color: colors.onCta }}>
            {getInitials(name || 'Student')}
          </Text>
        </View>
      )}

      <Text className="text-2xl text-ink-900 dark:text-ink-100 uppercase tracking-wide mb-2 font-display">
        {name || 'Student'}
      </Text>

      <View
        className={`flex-row items-center px-5 w-full ${!(studentId && semester) ? 'justify-center' : ''}`}
      >
        <View className={studentId && semester ? 'flex-1 items-end' : ''}>
          {studentId && (
            <View
              className="rounded-full px-2.5 py-0.5 border"
              style={{ backgroundColor: colors.ctaSoft, borderColor: colors.border }}
            >
              <Text className="text-[11px] font-sans-md" style={{ color: colors.cta }}>
                {studentId}
              </Text>
            </View>
          )}
        </View>

        {studentId && semester && (
          <View className="w-1 h-1 rounded-full bg-ink-400 mx-2" />
        )}

        <View className={studentId && semester ? 'flex-1 items-start' : ''}>
          {semester && (
            <View
              className="rounded-full px-2.5 py-0.5 border"
              style={{ backgroundColor: colors.ctaSoft, borderColor: colors.border }}
            >
              <Text className="text-[11px] font-sans-md" style={{ color: colors.cta }}>
                Semester {semester}
              </Text>
            </View>
          )}
        </View>
      </View>

      <RegistrationRollInfo registrationNo={registrationNo} rollNo={rollNo} />
    </View>
  );
}
