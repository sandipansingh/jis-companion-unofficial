import { Button, TextInput, View } from "@/src/components";
import { Lock, User } from "lucide-react-native";
import { StyleSheet } from "react-native";

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
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          icon={User}
          placeholder="Student ID"
          value={studentId}
          onChangeText={onStudentIdChange}
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
          onChangeText={onPasswordChange}
          isPassword
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
      </View>

      <Button
        title="Login"
        onPress={onSubmit}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 10,
  },
});
