import { useTheme } from "@/src/contexts/ThemeContext";
import { commonStyles } from "@/src/styles/commonStyles";
import { useRouter } from "expo-router";
import { BookOpen, ChevronLeft, Search } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LibraryHeaderCard, LibraryMenuCard } from "../components";

export default function LibraryHome() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const navigateToMyBooks = () => {
    router.push("/library/my-books");
  };

  const navigateToSearchReserve = () => {
    router.push("/library/search-reserve");
  };

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleBack} style={commonStyles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Library
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      <ScrollView style={commonStyles.scrollView}>
        <View style={styles.content}>
          <LibraryHeaderCard
            title="Library Services"
            description="Manage your borrowed books and discover new titles"
          />

          <LibraryMenuCard
            title="My Books"
            description="View and manage your borrowed books"
            icon={BookOpen}
            iconColor="#3B82F6"
            onPress={navigateToMyBooks}
          />

          <LibraryMenuCard
            title="Search & Reserve"
            description="Find books and reserve them instantly"
            icon={Search}
            iconColor="#10B981"
            onPress={navigateToSearchReserve}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.headerRow,
    ...commonStyles.header,
    paddingBottom: 7,
  },
  content: {
    padding: 20,
  },
});
