import { getMonthName, isSameDay } from "@/src/utils/dateHelpers";
import { Text, View } from "react-native";
import { RoutineTimelineItem } from "./RoutineTimelineItem";

interface ClassRoutineSectionProps {
  selectedDate: Date;
  routine: any[];
  isFallbackData: boolean;
  getDisplayTime: (classItem: any) => string;
  onClassPress: (classItem: any) => void;
}

export function ClassRoutineSection({
  selectedDate,
  routine,
  isFallbackData,
  getDisplayTime,
  onClassPress,
}: ClassRoutineSectionProps) {
  if (routine.length === 0) return null;

  const isToday = isSameDay(selectedDate, new Date());
  const dateLabel = isToday
    ? "Today's Classes"
    : `${selectedDate.getDate()} ${getMonthName(selectedDate.getMonth() + 1)}`;

  return (
    <View>
      <View className="flex-row items-center gap-2 mb-4">
        <Text
          className="text-base text-ink-950 dark:text-white font-display"
        >
          {dateLabel}
        </Text>
        {isFallbackData && (
          <View className="bg-ink-100 dark:bg-ink-900 rounded-full px-2.5 py-0.5">
            <Text
              className="text-[10px] text-ink-500 dark:text-ink-400 font-sans-md"
            >
              Based on previous week
            </Text>
          </View>
        )}
      </View>
      <View className="gap-0">
        {routine.map((classItem, index) => {
          const hasFacultyData = !!classItem.emp_code && classItem.emp_code.trim() !== "";
          return (
            <RoutineTimelineItem
              key={index}
              classItem={classItem}
              time={getDisplayTime(classItem)}
              isLast={index === routine.length - 1}
              onPress={hasFacultyData ? () => onClassPress(classItem) : undefined}
            />
          );
        })}
      </View>
    </View>
  );
}
