import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import {
  CreditsButton,
  DemoLoginButton,
  LoginForm,
  LoginLogo,
} from "../components";
import { useLoginData } from "../hooks";

export default function Login() {
  const {
    studentId,
    password,
    loading,
    setStudentId,
    setPassword,
    handleLogin,
    showCredits,
    handleDemoLogin,
  } = useLoginData();

  return (
    <View className="flex-1 bg-base">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: 40,
          justifyContent: "space-between",
        }}
        bounces
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <LoginLogo />
          <LoginForm
            studentId={studentId}
            password={password}
            loading={loading}
            onStudentIdChange={setStudentId}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
          />
          <DemoLoginButton onPress={handleDemoLogin} />
        </View>

        <CreditsButton onPress={showCredits} />
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
