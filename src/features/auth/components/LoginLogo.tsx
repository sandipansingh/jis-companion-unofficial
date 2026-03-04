import { Image, Text, View } from 'react-native';

import { securityImage } from '@/src/constants/images';
import { useDevice } from '@/src/hooks/useDevice';

export function LoginLogo() {
  const { isWeb } = useDevice();
  return (
    <View
      className="items-center"
      style={{
        marginTop: isWeb ? 32 : 72,
        marginBottom: isWeb ? 40 : 56,
      }}
    >
      <Image
        source={securityImage}
        style={isWeb ? { width: 72, height: 72 } : { width: 120, height: 120 }}
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
