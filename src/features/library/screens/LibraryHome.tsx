import { Header, HeaderCard, MenuCard } from "@/src/components";
import { useRouter } from "expo-router";
import { BookOpen, Search } from "lucide-react-native";
import { ScrollView, View } from "react-native";

export default function LibraryHome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-base">
      <Header title="Library" showBackButton />
      <ScrollView className="flex-1">
        <View className="p-5 gap-4">
          <HeaderCard
            title="Library Services"
            description="Manage your borrowed books and discover new titles"
            icon={BookOpen}
          />
          <MenuCard
            title="My Books"
            description="View and manage your borrowed books"
            icon={BookOpen}
            iconColor="#2B5BDB"
            onPress={() => router.push("/library/my-books")}
          />
          <MenuCard
            title="Search & Reserve"
            description="Find books and reserve them instantly"
            icon={Search}
            iconColor="#059669"
            onPress={() => router.push("/library/search-reserve")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
