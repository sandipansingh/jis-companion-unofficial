import { View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAlertStore } from "@/src/store/alertStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { router } from "expo-router";
import { FlaskConical, Library } from "lucide-react-native";
import { ScrollView, StyleSheet } from "react-native";
import {
  MenuItem,
  NextClassCard,
  QuickAccessGrid,
  WelcomeCard,
} from "../components";
import { useHomeData } from "../hooks";

const MENU_ITEMS: MenuItem[] = [
  {
    id: "virtual_labs",
    title: "Virtual Labs",
    icon: FlaskConical,
    color: "#3B82F6",
  },
  {
    id: "library",
    title: "Library",
    icon: Library,
    color: "#22C55E",
  },
];

export default function Home() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const { showAlert } = useAlertStore();

  const {
    loginData,
    userData,
    attendanceData,
    loadingAttendance,
    getNextClass,
    getFormattedTime,
  } = useHomeData();

  const nextClass = getNextClass();

  const handleMenuItemPress = (itemId: string) => {
    if (itemId === "virtual_labs") {
      router.push("/virtual-labs");
    } else if (itemId === "library") {
      router.push("/library");
    } else {
      showAlert({
        title:
          MENU_ITEMS.find((item) => item.id === itemId)?.title || "Feature",
        message: "Coming soon!",
      });
    }
  };

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      <WelcomeCard
        userName={loginData?.student_name || "Student"}
        profileImageUrl={userData?.profile_pict_cur_url}
        courseName={loginData?.batch_name || "CSE"}
        collegeName={loginData?.college_sht_name || "N/A"}
        attendancePercentage={attendanceData?.pcent || 0}
        attendedDays={attendanceData?.attd || 0}
        totalDays={attendanceData?.total_class || 0}
        loadingAttendance={loadingAttendance}
      />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          {nextClass && (
            <NextClassCard
              className={
                nextClass.subject_name.split(" - ")[1]?.trim() ||
                nextClass.subject_name
              }
              faculty={nextClass.faculty}
              time={getFormattedTime(nextClass.Period_name).time}
              period={getFormattedTime(nextClass.Period_name).period}
              isFallback={(nextClass as any)._isFallback}
              onSeeAll={() => router.push("/academics")}
            />
          )}

          <QuickAccessGrid
            items={MENU_ITEMS}
            onItemPress={handleMenuItemPress}
          />
        </View>

        <View style={{ height: bottomOffset + 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: "transparent",
  },
});
