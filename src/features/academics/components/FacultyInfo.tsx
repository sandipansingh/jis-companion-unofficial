import { Text, View } from "react-native";

interface FacultyInfoProps {
  facultyName: string;
}

function getInitials(name: string) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function FacultyInfo({ facultyName }: FacultyInfoProps) {
  return (
    <View className="mt-2 bg-ink-100 dark:bg-ink-800 rounded-xl flex-row items-center gap-3 p-3">
      <View className="w-10 h-10 rounded-full bg-cobalt-50 dark:bg-cobalt-900/40 border border-border items-center justify-center">
        <Text
          className="text-xs text-cobalt-600 dark:text-cobalt-300"
          style={{ fontFamily: "ClashDisplay-Semibold" }}
        >
          {getInitials(facultyName)}
        </Text>
      </View>
      <View>
        <Text
          className="text-[10px] text-ink-500 dark:text-ink-400 uppercase tracking-widest"
          style={{ fontFamily: "GeneralSans-Semibold" }}
        >
          Faculty
        </Text>
        <Text
          className="text-sm text-ink-900 dark:text-white"
          style={{ fontFamily: "GeneralSans-Semibold" }}
        >
          {facultyName}
        </Text>
      </View>
    </View>
  );
}
