import { Image, Platform, Text, View } from "react-native";

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
        resizeMode="contain"
      />
      <Text
        className="text-[32px] text-ink-950 dark:text-ink-500 mt-6 tracking-tight"
        style={{ fontFamily: "ClashDisplay-Bold" }}
      >
        JIS Companion
      </Text>
      <Text
        className="text-sm text-ink-500 mt-1.5 tracking-wide"
        style={{ fontFamily: "GeneralSans-Regular" }}
      >
        Your student dashboard
      </Text>
    </View>
  );
}
