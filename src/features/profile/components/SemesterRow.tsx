import { Text, View } from "@/src/components";

interface SemesterRowProps {
  semester: number;
  sgpa?: number | string;
}

export function SemesterRow({ semester, sgpa }: SemesterRowProps) {
  return (
    <View className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-surface dark:bg-ink-900">
      <Text
        className="text-sm text-ink-900 dark:text-white"
        style={{ fontFamily: 'GeneralSans-Medium' }}
      >
        Semester {semester}
      </Text>
      {sgpa ? (
        <View className="px-3 py-1 rounded-xl bg-success-light dark:bg-green-900/30 border border-success/30 dark:border-green-800">
          <Text
            className="text-xs text-success dark:text-green-400"
            style={{ fontFamily: 'GeneralSans-Bold' }}
          >
            SGPA: {sgpa}
          </Text>
        </View>
      ) : (
        <View className="px-3 py-1 rounded-xl bg-ink-100 dark:bg-ink-800">
          <Text
            className="text-xs text-ink-400"
            style={{ fontFamily: "GeneralSans-Bold" }}
          >
            N/A
          </Text>
        </View>
      )}
    </View>
  );
}
