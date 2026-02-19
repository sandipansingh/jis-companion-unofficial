import { Pressable, Text } from "react-native";

interface CreditsButtonProps {
  onPress: () => void;
}

export function CreditsButton({ onPress }: CreditsButtonProps) {
  return (
    <Pressable onPress={onPress} className="py-3 items-center mt-4">
      <Text
        className="text-xs text-ink-400 tracking-widest uppercase"
        style={{ fontFamily: "GeneralSans-Regular" }}
      >
        Credits
      </Text>
    </Pressable>
  );
}
