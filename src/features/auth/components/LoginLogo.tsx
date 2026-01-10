import { Image, Platform, StyleSheet } from "react-native";

export function LoginLogo() {
  return (
    <Image
      source={require("@/assets/images/security.png")}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginTop: Platform.select({ web: 40, default: 70 }),
    marginBottom: Platform.select({ web: 40, default: 70 }),
  },
});
