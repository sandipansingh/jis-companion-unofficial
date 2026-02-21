import { Text, View } from "@/src/components";

interface SubjectRowProps {
  subject: string;
  obtained: number;
  full: number;
}

export function SubjectRow({ subject, obtained, full }: SubjectRowProps) {
  return (
    <View className="flex-row items-center justify-between py-1.5">
      <Text
        className="text-sm text-ink-900 dark:text-ink-200 font-sans-md"
      >
        {subject}
      </Text>
      <Text
        className="text-sm text-cobalt-500 dark:text-cobalt-300 font-sans-bold"
      >
        {obtained}/{full}
      </Text>
    </View>
  );
}
