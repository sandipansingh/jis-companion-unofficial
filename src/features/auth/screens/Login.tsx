import { useTheme } from "@/src/contexts/ThemeContext";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { CreditsButton, LoginForm, LoginLogo } from "../components";
import { useLoginData } from "../hooks";

export default function Login() {
  const { colors } = useTheme();
  const {
    studentId,
    password,
    loading,
    setStudentId,
    setPassword,
    handleLogin,
    showCredits,
  } = useLoginData();

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
        <LoginLogo />

        <LoginForm
          studentId={studentId}
          password={password}
          loading={loading}
          onStudentIdChange={setStudentId}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />

        <CreditsButton onPress={showCredits} />
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
