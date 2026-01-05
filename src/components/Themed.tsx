import { useTheme } from "@/src/contexts/ThemeContext";
import { Text as DefaultText, View as DefaultView } from "react-native";

export type TextProps = DefaultText["props"];
export type ViewProps = DefaultView["props"];

export function Text(props: TextProps) {
  const { colors } = useTheme();
  const { style, ...otherProps } = props;

  return (
    <DefaultText style={[{ color: colors.text }, style]} {...otherProps} />
  );
}

export function View(props: ViewProps) {
  const { colors } = useTheme();
  const { style, ...otherProps } = props;

  return (
    <DefaultView
      style={[{ backgroundColor: colors.background }, style]}
      {...otherProps}
    />
  );
}
