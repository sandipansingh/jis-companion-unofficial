import { Text, View } from "@/src/components";

interface AcademicCardProps {
  title: string;
  score: string;
}

export function AcademicCard({ title, score }: AcademicCardProps) {
  return (
    <View className="flex-1 p-4 rounded-xl border border-border bg-surface dark:bg-ink-900 items-center" style={{ minWidth: 100 }}>
      <Text
        className="text-xs text-ink-500 dark:text-ink-400 mb-2 text-center"
        style={{ fontFamily: "GeneralSans-Medium" }}
      >
        {title}
      </Text>
      <Text
        className="text-xl text-ink-900 dark:text-white"
        style={{ fontFamily: "ClashDisplay-Bold" }}
      >
        {score}
      </Text>
    </View>
  );
}
