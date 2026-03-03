import { Image, Platform, Text, View } from 'react-native';

import { securityImage } from '@/src/constants/images';

export function LoginLogo() {
  return (
    <View
      className="items-center"
      style={{
        marginTop: Platform.select({ web: 32, default: 72 }),
        marginBottom: Platform.select({ web: 40, default: 56 }),
      }}
    >
      <Image
        source={securityImage}
        className="w-[120px] h-[120px]"
        resizeMode="contain"
        accessible={false}
      />
      <Text className="text-[32px] text-ink-950 dark:text-ink-500 mt-6 tracking-tight font-display-bold">
        Companion
      </Text>
      <Text className="text-sm text-ink-500 mt-1.5 tracking-wide font-sans">
        Your student dashboard
      </Text>
    </View>
  );
}
