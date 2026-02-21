import { EmptyState, Header, LoadingState } from "@/src/components";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { FlashList } from "@shopify/flash-list";
import { BookOpen } from "lucide-react-native";
import { View } from "react-native";
import { BookCard } from "../components";
import { LibraryTabs } from "../components/LibraryTabs";
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
        <LibraryTabs
          activeTab={filterType}
          onTabChange={(tab) => handleFilterChange(tab as any)}
        />
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
        <FlashList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item: any, index: number) => `${item.reader_acc_id}-${index}`}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: bottomOffset + 20 }}
          showsVerticalScrollIndicator={true}
        />
      )}
    </View>
  );
}
