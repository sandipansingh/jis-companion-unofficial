import { Header } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useSettingsStore } from "@/src/features/settings/store/settingsStore";
import {
  CheckSquare,
  ClipboardList,
  GraduationCap,
  LucideIcon,
  Settings,
  Square,
  Trophy,
  Video,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const InfoCard = ({
  icon: Icon,
  iconColor,
  accentColor,
  title,
  isDark,
  children,
}: {
  icon: LucideIcon;
  iconColor: string;
  accentColor: string;
  title: string;
  isDark: boolean;
  children: React.ReactNode;
}) => (
  <View
    className="rounded-2xl overflow-hidden mb-4 border border-border bg-surface dark:bg-ink-900"
    style={{
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0 : 0.05,
      shadowRadius: 8,
      elevation: isDark ? 0 : 2,
    }}
  >
    <View className="p-5">
      {/* Card header */}
      <View className="flex-row items-center mb-4 gap-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: accentColor + "1A" }}
        >
          <Icon size={20} color={iconColor} />
        </View>
        <Text
          className="text-base text-ink-900 dark:text-white"
          style={{ fontFamily: "ClashDisplay-Semibold" }}
        >
          {title}
        </Text>
      </View>

      <View className="gap-2">{children}</View>
    </View>
  </View>
);

const InfoItem = ({ text, isDark }: { text: string; isDark: boolean }) => (
  <View className="flex-row items-start py-0.5">
    <View
      className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
      style={{
        backgroundColor: isDark ? "#4C7EF3" : "#2B5BDB",
        flexShrink: 0,
      }}
    />
    <Text
      className="text-sm text-ink-600 dark:text-ink-400 leading-5 flex-1"
      style={{ fontFamily: "GeneralSans-Regular" }}
    >
      {text}
    </Text>
  </View>
);

const PromptBox = ({
  label,
  isDark,
  children,
}: {
  label: string;
  isDark: boolean;
  children: React.ReactNode;
}) => (
  <View
    className="rounded-xl p-4 mt-2"
    style={{
      backgroundColor: isDark ? "#0A2672" : "#EEF3FF",
      borderWidth: 1,
      borderColor: isDark ? "#1240BE" : "#B3CCFE",
    }}
  >
    <Text
      className="text-xs uppercase tracking-widest mb-3"
      style={{
        fontFamily: "GeneralSans-Semibold",
        color: isDark ? "#7DAAF9" : "#1B4FD8",
      }}
    >
      {label}
    </Text>
    <View className="gap-1">{children}</View>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function Guidelines() {
  const { isDark } = useTheme();
  const hasReadGuidelines = useSettingsStore(
    (s) => s.hasReadVideoByteGuidelines
  );
  const setHasReadVideoByteGuidelines = useSettingsStore(
    (s) => s.setHasReadVideoByteGuidelines
  );

  return (
    <View className="flex-1 bg-base">
      <Header title="Guidelines" showBackButton />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Page header */}
          <View className="mt-2 mb-6">
            <Text
              className="text-2xl text-ink-900 dark:text-white mb-1"
              style={{ fontFamily: "ClashDisplay-Bold" }}
            >
              Video Byte Rules
            </Text>
            <Text
              className="text-sm text-ink-500 dark:text-ink-400 leading-5"
              style={{ fontFamily: "GeneralSans-Regular" }}
            >
              Read carefully before recording your submission
            </Text>
          </View>

          {/* Cards */}
          <InfoCard
            icon={Video}
            iconColor="#2B5BDB"
            accentColor="#2B5BDB"
            title="Video Requirements"
            isDark={isDark}
          >
            <InfoItem
              text="Record using your phone in portrait mode"
              isDark={isDark}
            />
            <InfoItem
              text="Duration: 30 seconds to 90 seconds"
              isDark={isDark}
            />
            <InfoItem text="Upload directly to your profile" isDark={isDark} />
            <InfoItem
              text="Choose Hindi, English, or Bengali"
              isDark={isDark}
            />
            <InfoItem
              text="Clear audio without background noise"
              isDark={isDark}
            />
          </InfoCard>

          <InfoCard
            icon={ClipboardList}
            iconColor="#059669"
            accentColor="#059669"
            title="Important Rules"
            isDark={isDark}
          >
            <InfoItem
              text="Videos cannot be deleted or edited once saved"
              isDark={isDark}
            />
            <InfoItem
              text="Multiple attempts allowed before final save"
              isDark={isDark}
            />
            <InfoItem
              text="Only you and admin can view your videos"
              isDark={isDark}
            />
            <InfoItem
              text="Be respectful and family-friendly"
              isDark={isDark}
            />
            <InfoItem
              text="No explicit language or vulgarity"
              isDark={isDark}
            />
          </InfoCard>

          <InfoCard
            icon={Settings}
            iconColor="#DC2626"
            accentColor="#DC2626"
            title="Technical Guidelines"
            isDark={isDark}
          >
            <InfoItem text="Must be in portrait orientation" isDark={isDark} />
            <InfoItem
              text="Ensure good lighting and clear audio"
              isDark={isDark}
            />
            <InfoItem
              text="Wear uniform or casual clothes"
              isDark={isDark}
            />
            <InfoItem
              text="File name: FirstNameLastName_CollegeName"
              isDark={isDark}
            />
          </InfoCard>

          <InfoCard
            icon={GraduationCap}
            iconColor="#7C3AED"
            accentColor="#7C3AED"
            title="Orientation Video"
            isDark={isDark}
          >
            <Text
              className="text-sm text-ink-600 dark:text-ink-400"
              style={{ fontFamily: "GeneralSans-Medium" }}
            >
              Submit during the orientation phase
            </Text>
            <PromptBox label="What to include" isDark={isDark}>
              <InfoItem
                text="Your name, branch, and year"
                isDark={isDark}
              />
              <InfoItem
                text="What excites you about college life?"
                isDark={isDark}
              />
              <InfoItem
                text="Your career goals after graduation"
                isDark={isDark}
              />
            </PromptBox>
          </InfoCard>

          <InfoCard
            icon={Trophy}
            iconColor="#F59E0B"
            accentColor="#F59E0B"
            title="Final Semester Video"
            isDark={isDark}
          >
            <Text
              className="text-sm text-ink-600 dark:text-ink-400"
              style={{ fontFamily: "GeneralSans-Medium" }}
            >
              Required for final semester admit card
            </Text>
            <PromptBox label="What to include" isDark={isDark}>
              <InfoItem
                text="Your name, branch, and year"
                isDark={isDark}
              />
              <InfoItem
                text="How has the institute helped you grow?"
                isDark={isDark}
              />
              <InfoItem
                text="Advice you'd share with juniors"
                isDark={isDark}
              />
            </PromptBox>
          </InfoCard>

          <View className="h-10" />

          {/* I have read checkbox */}
          <Pressable
            onPress={() =>
              setHasReadVideoByteGuidelines(!hasReadGuidelines)
            }
            className="flex-row items-center rounded-2xl p-4 mb-6 border border-border bg-surface dark:bg-ink-900 gap-3"
            style={{
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0 : 0.05,
              shadowRadius: 8,
              elevation: isDark ? 0 : 2,
            }}
          >
            {hasReadGuidelines ? (
              <CheckSquare size={22} color={isDark ? "#4C7EF3" : "#2B5BDB"} />
            ) : (
              <Square size={22} color={isDark ? "#475569" : "#94A3B8"} />
            )}
            <Text
              className="flex-1 text-sm leading-5"
              style={{
                fontFamily: "GeneralSans-Medium",
                color: hasReadGuidelines
                  ? isDark
                    ? "#4C7EF3"
                    : "#2B5BDB"
                  : isDark
                  ? "#94A3B8"
                  : "#475569",
              }}
            >
              I have read the rules and guidelines
            </Text>
          </Pressable>

          <View className="h-4" />
        </View>
      </ScrollView>
    </View>
  );
}

