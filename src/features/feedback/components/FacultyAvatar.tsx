import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface FacultyAvatarProps {
  imageUrl?: string;
  shortName: string;
  size?: number;
}

export function FacultyAvatar({ imageUrl, shortName, size = 48 }: FacultyAvatarProps) {
  const { colors } = useTheme();
  const borderRadius = size / 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor: colors.primaryLight,
        borderColor: colors.border,
      }}
      className="border overflow-hidden items-center justify-center"
    >
      {imageUrl ? (
        <Image
          source={{ uri: `https://jisgroup.net/hr/UploadFile/${imageUrl}` }}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <Text
          style={{
            fontSize: size > 60 ? 28 : 14,
            color: colors.primary,
          }}
          className="font-sans-semi"
        >
          {shortName}
        </Text>
      )}
    </View>
  );
}
