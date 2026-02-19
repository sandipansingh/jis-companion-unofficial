import { useAlertStore } from "@/src/store/alertStore";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { router } from "expo-router";
import {
  FlaskConical,
  Library,
  MessageSquare
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import {
  MenuItem,
  NextClassCard,
  QuickAccessGrid,
  WelcomeCard,
} from "../components";
import { useHomeData } from "../hooks";

export default function Home() {
  const { bottomOffset } = useSafeAreaStore();
  const { showAlert } = useAlertStore();

  const MENU_ITEMS: MenuItem[] = [
    {
      id: "virtual-labs",
      title: "Virtual Labs",
      icon: FlaskConical,
      color: "#3B82F6",
    },
    {
      id: "library",
      title: "Library",
      icon: Library,
      color: "#10B981",
    },
    {
      id: "feedback",
      title: "Feedback",
      icon: MessageSquare,
      color: "#F59E0B",
    },
    // {
    //   id: "profile-video",
    //   title: "Profile Video",
    //   icon: Video,
    //   color: "#EF4444",
    // },
  ];

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
    if (itemId === "virtual-labs") {
      router.push("/virtual-labs");
    } else if (itemId === "library") {
      router.push("/library");
    } else if (itemId === "feedback") {
      router.push("/feedback");
    } else if (itemId === "profile-video") {
      router.push("/profile-video");
    } else {
      showAlert({
        title:
          MENU_ITEMS.find((item) => item.id === itemId)?.title || "Feature",
        message: "Coming soon!",
      });
    }
  };

  return (
    <View className="flex-1 bg-base">
      <WelcomeCard
        userName={loginData?.student_name || "Student"}
        profileImageUrl={userData?.profile_pict_cur_url}
        courseName={loginData?.batch_name || "CSE AI & ML"}
        collegeName={loginData?.college_sht_name || "N/A"}
        attendancePercentage={attendanceData?.pcent || 0}
        attendedClass={attendanceData?.attd || 0}
        totalClass={attendanceData?.total_class || 0}
        loadingAttendance={loadingAttendance}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View className="px-6 pt-6">
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
