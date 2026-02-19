import { EmptyState, Header, LoadingState, TabButton } from "@/src/components";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { BookOpen } from "lucide-react-native";
import { FlatList, View } from "react-native";
import { BookCard } from "../components";
import { useMyBooksData } from "../hooks";

export default function MyBooks() {
  const { bottomOffset } = useSafeAreaStore();
  const { books, loading, filterType, handleFilterChange } = useMyBooksData();

  const renderBookItem = ({ item }: { item: any }) => (
    <View className="px-4">
      <BookCard book={item} />
    </View>
  );

  return (
    <View className="flex-1 bg-base">
      <Header title="My Books" showBackButton />

      {/* Filter tabs */}
      <View className="px-4 pt-4 pb-2">
        <View
          className="flex-row bg-ink-100 dark:bg-ink-900 rounded-2xl p-1"
          style={{
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
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
          contentContainerStyle={{ paddingTop: 8, paddingBottom: bottomOffset + 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
