import { Text, View } from "react-native";

const ITEMS = [
  { label: "Present", bg: "#ECFDF5", border: "#059669" },
  { label: "Partial", bg: "#FFFBEB", border: "#D97706" },
  { label: "Absent", bg: "#FEF2F2", border: "#DC2626"},
];

export function AttendanceLegend() {
  return (
    <View className="flex-row justify-center gap-4 pt-3 border-t border-border">
      {ITEMS.map(({ label, bg, border }) => (
        <View key={label} className="flex-row items-center gap-1.5">
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: bg,
              borderWidth: 2,
              borderColor: border,
            }}
          />
          <Text
            className="text-[11px] font-sans text-[#64748B]"
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
