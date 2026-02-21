import { Search } from "lucide-react-native";
import { Text, View } from "react-native";

export function SearchInfoCard() {
  return (
    <View
      className="bg-surface dark:bg-surface rounded-2xl border border-border p-7 items-center"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="w-18 h-18 rounded-full bg-cobalt-50 dark:bg-ink-900 border border-border items-center justify-center mb-4">
        <Search size={32} color="#2B5BDB" />
      </View>
      <Text
        className="text-xl text-ink-900 dark:text-white mb-2 text-center font-display"
      >
        Library Search
      </Text>
      <Text
        className="text-sm text-ink-500 text-center leading-relaxed font-sans"
      >
        Search for books by title, author, call number, or ISBN and reserve them instantly.
      </Text>
    </View>
  );
}
