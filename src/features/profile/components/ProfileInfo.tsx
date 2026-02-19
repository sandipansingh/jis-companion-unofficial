import { Image, Text, View } from "react-native";
import { RegistrationRollInfo } from "./RegistrationRollInfo";

interface ProfileInfoProps {
  profileImageUrl?: string;
  name?: string;
  studentId?: string;
  semester?: string | number;
  registrationNo?: string;
  rollNo?: string;
  getInitials: (name: string) => string;
}

export function ProfileInfo({
  profileImageUrl,
  name,
  studentId,
  semester,
  registrationNo,
  rollNo,
  getInitials,
}: ProfileInfoProps) {
  return (
    <View className="items-center pt-6 pb-4">
      {/* Avatar */}
      {profileImageUrl ? (
        <Image
          source={{ uri: profileImageUrl }}
          className="w-28 h-28 rounded-2xl mb-4"
          style={{
            borderWidth: 3,
            borderColor: "#EEF3FF",
            shadowColor: "#2B5BDB",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
          }}
        />
      ) : (
        <View
          className="w-28 h-28 rounded-2xl mb-4 bg-cobalt-500 items-center justify-center"
          style={{
            borderWidth: 3,
            borderColor: "#EEF3FF",
            shadowColor: "#2B5BDB",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
          }}
        >
          <Text
            className="text-4xl text-white"
            style={{ fontFamily: "ClashDisplay-Bold" }}
          >
            {getInitials(name || "Student")}
          </Text>
        </View>
      )}

      {/* Name */}
      <Text
        className="text-2xl text-ink-900 dark:text-ink-100 uppercase tracking-wide mb-2"
        style={{ fontFamily: "ClashDisplay-Semibold" }}
      >
        {name || "Student"}
      </Text>

      {/* ID + Semester row */}
      <View className="flex-row items-center gap-2">
        {studentId && (
          <Text
            className="text-sm text-cobalt-600 dark:text-cobalt-400"
            style={{ fontFamily: "GeneralSans-Semibold" }}
          >
            {studentId}
          </Text>
        )}
        {studentId && semester && (
          <View className="w-1 h-1 rounded-full bg-ink-400" />
        )}
        {semester && (
          <View className="bg-cobalt-50 dark:bg-cobalt-900 border border-border rounded-full px-3 py-1">
            <Text
              className="text-[10px] text-cobalt-600 dark:text-cobalt-300 uppercase tracking-widest"
              style={{ fontFamily: "GeneralSans-Semibold" }}
            >
              Semester {semester}
            </Text>
          </View>
        )}
      </View>

      <RegistrationRollInfo
        registrationNo={registrationNo}
        rollNo={rollNo}
      />
    </View>
  );
}
