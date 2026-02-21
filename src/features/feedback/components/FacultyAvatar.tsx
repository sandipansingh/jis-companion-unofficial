import { Image } from "expo-image";
import { Text, View } from "react-native";

interface FacultyAvatarProps {
  imageUrl?: string;
  shortName: string;
  size?: number;
}

export function FacultyAvatar({ imageUrl, shortName, size = 48 }: FacultyAvatarProps) {
  const borderRadius = size / 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius,
        overflow: "hidden",
        backgroundColor: "#EEF3FF",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: `https://jisgroup.net/hr/UploadFile/${imageUrl}` }}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <Text
          style={{
            fontFamily: "ClashDisplay-Semibold",
            fontSize: size > 60 ? 28 : 14,
            color: "#2B5BDB",
          }}
        >
          {shortName}
        </Text>
      )}
    </View>
  );
}
