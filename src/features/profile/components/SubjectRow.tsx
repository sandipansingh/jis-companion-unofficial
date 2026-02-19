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
        className="text-sm text-ink-900 dark:text-ink-200"
        style={{ fontFamily: 'GeneralSans-Medium' }}
      >
        {subject}
      </Text>
      <Text
        className="text-sm text-cobalt-500 dark:text-cobalt-300"
        style={{ fontFamily: 'GeneralSans-Bold' }}
      >
        {obtained}/{full}
      </Text>
    </View>
  );
}
