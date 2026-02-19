import { Text, View } from "react-native";

interface RegistrationRollInfoProps {
  registrationNo?: string;
  rollNo?: string;
}

export function RegistrationRollInfo({
  registrationNo,
  rollNo,
}: RegistrationRollInfoProps) {
  if (!registrationNo && !rollNo) return null;

  return (
    <View className="flex-row gap-3 mt-3 w-full px-4">
      {registrationNo && (
        <View className="flex-1 bg-surface dark:bg-ink-900 border border-border rounded-xl px-3 py-2.5 items-center">
          <Text
            className="text-[9px] text-ink-500 dark:text-ink-400 tracking-widest uppercase mb-0.5"
            style={{ fontFamily: "GeneralSans-Semibold" }}
          >
            Registration
          </Text>
          <Text
            className="text-xs text-ink-900 dark:text-white text-center"
            style={{ fontFamily: "GeneralSans-Medium" }}
          >
            {registrationNo}
          </Text>
        </View>
      )}
      {rollNo && (
        <View className="flex-1 bg-surface dark:bg-ink-900 border border-border rounded-xl px-3 py-2.5 items-center">
          <Text
            className="text-[9px] text-ink-500 dark:text-ink-400 tracking-widest uppercase mb-0.5"
            style={{ fontFamily: "GeneralSans-Semibold" }}
          >
            Univ Roll
          </Text>
          <Text
            className="text-xs text-ink-900 dark:text-white text-center"
            style={{ fontFamily: "GeneralSans-Medium" }}
          >
            {rollNo}
          </Text>
        </View>
      )}
    </View>
  );
}
