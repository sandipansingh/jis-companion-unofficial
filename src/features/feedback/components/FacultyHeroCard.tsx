import { Text, View } from "react-native";
import { FacultyFeedbackItem } from "../api";
import { FacultyAvatar } from "./FacultyAvatar";

interface FacultyHeroCardProps {
  faculty: FacultyFeedbackItem;
}

export function FacultyHeroCard({ faculty }: FacultyHeroCardProps) {
  return (
    <View
      className="bg-surface dark:bg-ink-900 rounded-2xl border border-border p-5 items-center mb-4"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <FacultyAvatar imageUrl={faculty.fac_image} shortName={faculty.fac_sht_name} size={80} />
      <Text
        className="text-xl text-ink-900 dark:text-white mt-3 text-center"
        style={{ fontFamily: 'ClashDisplay-Semibold' }}
      >
        {faculty.fac_name}
      </Text>
      <Text
        className="text-[10px] text-ink-500 dark:text-ink-400 uppercase tracking-widest mt-1"
        style={{ fontFamily: 'GeneralSans-Semibold' }}
      >
        {faculty.sub_code}
      </Text>
      <Text
        className="text-sm text-ink-600 dark:text-ink-300 mt-1 text-center"
        style={{ fontFamily: 'GeneralSans-Regular' }}
      >
        {faculty.sub_name}
      </Text>
    </View>
  );
}
