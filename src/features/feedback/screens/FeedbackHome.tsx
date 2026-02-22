import { Header, HeaderCard, MenuCard } from "@/src/components";
import { useRouter } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import { ScrollView, View } from "react-native";

export default function FeedbackHome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-base">
      <Header title="Feedback" showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-2">
          <HeaderCard
            variant="hero"
            title="Student Feedback"
            description="Share your feedback on faculty and courses"
            icon={MessageCircle}
          />
          <MenuCard
            title="Faculty Feedback"
            description="Rate and provide feedback for your faculty"
            icon={MessageCircle}
            iconColor="#DC2626"
            onPress={() => router.push("/feedback/faculty")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
