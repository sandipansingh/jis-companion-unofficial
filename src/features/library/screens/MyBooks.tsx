import { EmptyState, LoadingState, TabButton } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { useRouter } from "expo-router";
import { BookOpen, ChevronLeft } from "lucide-react-native";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BookCard } from "../components";
import { useMyBooksData } from "../hooks";

export default function MyBooks() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const router = useRouter();
  const { books, loading, filterType, handleFilterChange } = useMyBooksData();

  const handleBack = () => {
    router.back();
  };

  const renderBookItem = ({ item }: { item: any }) => <BookCard book={item} />;

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleBack} style={commonStyles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          My Books
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      <View style={styles.filterContainer}>
        <View style={[styles.filterTabs, { backgroundColor: colors.surface }]}>
          <TabButton
            label="All Books"
            isActive={filterType === "1"}
            onPress={() => handleFilterChange("1")}
          />
          <TabButton
            label="To Return"
            isActive={filterType === "2"}
            onPress={() => handleFilterChange("2")}
          />
        </View>
      </View>

      {loading ? (
        <LoadingState message="Loading your books..." />
      ) : books.length === 0 ? (
        <EmptyState
          message={
            filterType === "1"
              ? "You haven't borrowed any books yet"
              : "No books pending return"
          }
          icon={BookOpen}
        />
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item, index) => `${item.reader_acc_id}-${index}`}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: bottomOffset + 20 },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.headerRow,
    ...commonStyles.header,
    paddingBottom: 7,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterTabs: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  listContainer: {
    padding: 16,
  },
});
