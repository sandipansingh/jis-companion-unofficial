import { Button, TextInput } from "@/src/components";
import { Lock, User } from "lucide-react-native";
import { Text, View } from "react-native";

interface LoginFormProps {
  studentId: string;
  password: string;
  loading: boolean;
  onStudentIdChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export function LoginForm({
  studentId,
  password,
  loading,
  onStudentIdChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <View className="w-full gap-4">
      <Text
        className="text-2xl text-ink-950 dark:text-white mb-2 font-display"
      >
        Sign in
      </Text>

      <TextInput
        icon={User}
        placeholder="Student ID"
        value={studentId}
        onChangeText={onStudentIdChange}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />

      <TextInput
        icon={Lock}
        placeholder="Password"
        value={password}
        onChangeText={onPasswordChange}
        isPassword
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />

      <View className="mt-2">
        <Button
          title="Sign in"
          onPress={onSubmit}
          loading={loading}
          size="lg"
        />
      </View>
    </View>
  );
}
