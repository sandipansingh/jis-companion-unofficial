import { Header, HeaderCard, MenuCard } from "@/src/components";
import { useSettingsStore } from "@/src/features/settings/store/settingsStore";
import { useRouter } from "expo-router";
import { BookOpen, Lock, Play, Video } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

export default function VideoByteHome() {
  const router = useRouter();
  const hasReadGuidelines = useSettingsStore(
    (s) => s.hasReadVideoByteGuidelines
  );

  return (
    <View className="flex-1 bg-base">
      <Header title="Video Byte" showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-2">
          <HeaderCard
            variant="hero"
            icon={Video}
            title="Video Byte Library"
            description="Record and submit your student journey. Capture your experience from orientation to graduation."
            note={
              !hasReadGuidelines
                ? "Read the rules & guidelines first to unlock sample videos and recording."
                : undefined
            }
          />

          {/* Section label */}
          <Text
            className="text-xs text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-3 ml-1"
            style={{ fontFamily: "GeneralSans-Semibold" }}
          >
            Get Started
          </Text>

          {/* Action cards */}
          <MenuCard
            title="Rules & Guidelines"
            description="Important rules and requirements for video submission"
            icon={BookOpen}
            iconColor="#2B5BDB"
            onPress={() => router.push("/video-byte/guidelines")}
          />
          <MenuCard
            title="Sample Videos"
            description={
              hasReadGuidelines
                ? "Watch reference videos in different languages"
                : "Read rules & guidelines to unlock"
            }
            icon={hasReadGuidelines ? Play : Lock}
            iconColor={hasReadGuidelines ? "#059669" : "#94A3B8"}
            onPress={() =>
              hasReadGuidelines
                ? router.push("/video-byte/sample-videos")
                : undefined
            }
            disabled={!hasReadGuidelines}
          />
          <MenuCard
            title="Record Video"
            description={
              hasReadGuidelines
                ? "Start recording your video submission"
                : "Read rules & guidelines to unlock"
            }
            icon={hasReadGuidelines ? Video : Lock}
            iconColor={hasReadGuidelines ? "#DC2626" : "#94A3B8"}
            onPress={() =>
              hasReadGuidelines
                ? router.push("/video-byte/record")
                : undefined
            }
            disabled={!hasReadGuidelines}
          />
        </View>
      </ScrollView>
    </View>
  );
}
