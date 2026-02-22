import { Header } from "@/src/components";
import { Video } from "lucide-react-native";
import { Text, View } from "react-native";

export default function Record() {
  return (
    <View className="flex-1 bg-base">
      <Header title="Record Video" showBackButton />

      <View className="flex-1 items-center justify-center gap-4 px-6">
        <View className="w-20 h-20 rounded-3xl bg-cobalt-50 items-center justify-center mb-2">
          <Video size={36} color="#2B5BDB" />
        </View>
        <Text
          className="text-2xl text-ink-900 text-center"
          style={{ fontFamily: "ClashDisplay-Semibold" }}
        >
          Record Screen
        </Text>
        <Text
          className="text-sm text-ink-500 text-center leading-5"
          style={{ fontFamily: "GeneralSans-Regular" }}
        >
          Camera functionality will be implemented here
        </Text>
      </View>
    </View>
  );
}
