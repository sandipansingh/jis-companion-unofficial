import { Search } from "lucide-react-native";
import { Text, View } from "react-native";

export function NoResultsView() {
  return (
    <View className="items-center py-12 px-8">
      <View
        className="w-24 h-24 rounded-full bg-surface border border-border items-center justify-center mb-5"
        style={{
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Search size={40} color="#CBD5E1" />
      </View>
      <Text
        className="text-lg text-ink-900 mb-2"
        style={{ fontFamily: "ClashDisplay-Semibold" }}
      >
        No Results Found
      </Text>
      <Text
        className="text-sm text-ink-500 text-center"
        style={{ fontFamily: "GeneralSans-Regular" }}
      >
        Try adjusting your search query or filter
      </Text>
    </View>
  );
}
