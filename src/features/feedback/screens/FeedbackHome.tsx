import { HeaderCard } from "@/src/components/HeaderCard";
import { MenuCard } from "@/src/components/MenuCard";
import { useTheme } from "@/src/contexts/ThemeContext";
import { commonStyles } from "@/src/styles/commonStyles";
import { useRouter } from "expo-router";
import { ChevronLeft, MessageCircle } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FeedbackHome() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const navigateToFacultyFeedback = () => {
    router.push("/feedback/faculty");
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
          Feedback
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      <ScrollView style={commonStyles.scrollView}>
        <View style={styles.content}>
          <HeaderCard
            title="Student Feedback"
            description="Share your feedback on faculty and courses"
            icon={MessageCircle}
          />

          <MenuCard
            title="Faculty Feedback"
            description="Rate and provide feedback for your faculty"
            icon={MessageCircle}
            iconColor={colors.red}
            onPress={navigateToFacultyFeedback}
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
