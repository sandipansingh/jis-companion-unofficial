import { Header } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useVideoPlayer, VideoView } from "expo-video";
import { Eye, Lightbulb, Mic, SunMedium, Video } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const SAMPLE_VIDEOS = [
  {
    id: "english",
    label: "English",
    url: "http://122.252.249.26:5059/StdVideo/Samples/English.mp4",
  },
  {
    id: "hindi",
    label: "Hindi",
    url: "http://122.252.249.26:5059/StdVideo/Samples/Hindi.mp4",
  },
  {
    id: "bengali",
    label: "Bengali",
    url: "http://122.252.249.26:5059/StdVideo/Samples/Bangla.mp4",
  },
];

const TIPS = [
  { Icon: Eye, text: "Watch the sample videos carefully" },
  { Icon: Mic, text: "Note the speaking pace and clarity" },
  { Icon: SunMedium, text: "Observe the framing and lighting" },
  { Icon: Video, text: "Pay attention to the professional presentation" },
];

export default function SampleVideos() {
  const [selectedVideo, setSelectedVideo] = useState(SAMPLE_VIDEOS[0]);
  const { isDark } = useTheme();

  const player = useVideoPlayer(selectedVideo.url, (player) => {
    player.loop = false;
  });

  const handleSelectVideo = async (video: (typeof SAMPLE_VIDEOS)[0]) => {
    setSelectedVideo(video);
    await player.replaceAsync(video.url);
  };

  return (
    <View className="flex-1 bg-base">
      <Header title="Sample Videos" showBackButton />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Page header */}
          <View className="mt-2 mb-6">
            <Text
              className="text-2xl text-ink-900 dark:text-white mb-1"
              style={{ fontFamily: "ClashDisplay-Bold" }}
            >
              Reference Videos
            </Text>
            <Text
              className="text-sm text-ink-500 dark:text-ink-400 leading-5"
              style={{ fontFamily: "GeneralSans-Regular" }}
            >
              Watch samples in different languages to understand the format and
              expectations
            </Text>
          </View>

          {/* Language pill tabs */}
          <View className="mb-5">
            <Text
              className="text-xs text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-3 ml-1"
              style={{ fontFamily: "GeneralSans-Semibold" }}
            >
              Select Language
            </Text>
            <View className="flex-row gap-2">
              {SAMPLE_VIDEOS.map((video) => {
                const isSelected = selectedVideo.id === video.id;
                return (
                  <TouchableOpacity
                    key={video.id}
                    className="flex-1 py-3 rounded-xl items-center"
                    style={{
                      backgroundColor: isSelected
                        ? isDark
                          ? "#1B4FD8"
                          : "#2B5BDB"
                        : isDark
                          ? "#18181B"
                          : "#FFFFFF",
                      borderWidth: 1,
                      borderColor: isSelected
                        ? isDark
                          ? "#1B4FD8"
                          : "#2B5BDB"
                        : isDark
                          ? "#1E293B"
                          : "#E2E8F0",
                      shadowColor: "#0F172A",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: isDark ? 0 : 0.04,
                      shadowRadius: 2,
                      elevation: isDark ? 0 : 1,
                    }}
                    onPress={() => handleSelectVideo(video)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={{
                        fontFamily: isSelected
                          ? "GeneralSans-Semibold"
                          : "GeneralSans-Medium",
                        color: isSelected
                          ? "white"
                          : isDark
                            ? "#94A3B8"
                            : "#64748B",
                        fontSize: 14,
                      }}
                    >
                      {video.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Video player */}
          <View
            className="w-full bg-black rounded-3xl overflow-hidden mb-6"
            style={{
              aspectRatio: 9 / 16,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.35 : 0.1,
              shadowRadius: 24,
              elevation: 8,
            }}
          >
            <VideoView
              player={player}
              style={{ width: "100%", height: "100%" }}
              fullscreenOptions={{ enable: true }}
              nativeControls
            />
          </View>

          {/* Tips card */}
          <View
            className="bg-surface dark:bg-ink-900 rounded-2xl p-5 border border-border mb-6"
            style={{
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0 : 0.05,
              shadowRadius: 8,
              elevation: isDark ? 0 : 2,
            }}
          >
            {/* Card header */}
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{
                  backgroundColor: isDark ? "#1240BE" : "#EEF3FF",
                }}
              >
                <Lightbulb
                  size={18}
                  color={isDark ? "#7DAAF9" : "#2B5BDB"}
                />
              </View>
              <Text
                className="text-base text-ink-900 dark:text-white"
                style={{ fontFamily: "ClashDisplay-Semibold" }}
              >
                Before You Watch
              </Text>
            </View>

            {/* Tip list */}
            <View className="gap-3">
              {TIPS.map(({ Icon, text }, i) => (
                <View key={i} className="flex-row items-center gap-3">
                  <View
                    className="w-8 h-8 rounded-xl items-center justify-center"
                    style={{
                      backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      size={16}
                      color={isDark ? "#94A3B8" : "#64748B"}
                    />
                  </View>
                  <Text
                    className="text-sm text-ink-600 dark:text-ink-400 flex-1 leading-5"
                    style={{ fontFamily: "GeneralSans-Regular" }}
                  >
                    {text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

