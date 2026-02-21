import { TextInput } from "@/src/components";
import React from "react";
import { View } from "react-native";
import { SocialPlatform, formatSocialInput } from "../utils/social";

interface SocialInputProps {
  platform: SocialPlatform;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const SocialInput = React.memo(({ platform, label, value, onChange, placeholder }: SocialInputProps) => {
  const handleChange = (text: string) => {
    const formatted = formatSocialInput(platform, text);
    onChange(formatted);
  };

  return (
    <View>
      <TextInput
        label={label}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        autoCapitalize="none"
        keyboardType={platform === 'portfolio' ? 'url' : 'default'}
      />
    </View>
  );
});
