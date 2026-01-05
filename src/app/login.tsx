import { Button } from "@/src/components/Button";
import { TextInput } from "@/src/components/TextInput";
import { View } from "@/src/components/Themed";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { useAuthStore } from "@/src/store/authStore";
import { Lock, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

export default function LoginScreen() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlertStore();
  const login = useAuthStore((state) => state.login);
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      showAlert({
        title: "Error",
        message: "Please enter both Student ID and Password",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await login(studentId.trim(), password.trim());
      if (!success) {
        showAlert({
          title: "Login Failed",
          message: "Invalid Student ID or Password. Please try again.",
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error.message || "An error occurred during login",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("@/assets/images/security.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              icon={User}
              placeholder="Student ID"
              value={studentId}
              onChangeText={setStudentId}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              icon={Lock}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <Pressable
            onPress={() =>
              showAlert({
                title: "Credits",
                message:
                  "Password icons created by Roundicons Premium - Flaticon",
              })
            }
            style={styles.creditsButton}
          >
            <Text style={[styles.creditsText, { color: colors.textSecondary }]}>
              Credits
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.select({ web: 20, default: 40 }),
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginTop: Platform.select({ web: 40, default: 70 }),
    marginBottom: Platform.select({ web: 40, default: 70 }),
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 10,
  },
  creditsButton: {
    marginTop: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  creditsText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
