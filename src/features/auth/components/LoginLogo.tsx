import { Image } from "expo-image";
import { Platform, Text, View } from "react-native";

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
        source={require("@/assets/images/security.png")}
        style={{ width: 120, height: 120 }}
        contentFit="contain"
        accessible={false}
      />
      <Text
        className="text-[32px] text-ink-950 dark:text-ink-500 mt-6 tracking-tight font-display-bold"
      >
        JIS Companion
      </Text>
      <Text
        className="text-sm text-ink-500 mt-1.5 tracking-wide font-sans"
      >
        Your student dashboard
      </Text>
    </View>
  );
}
