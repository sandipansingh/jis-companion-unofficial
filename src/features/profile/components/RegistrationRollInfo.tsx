import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { StyleSheet } from "react-native";

interface RegistrationRollInfoProps {
  registrationNo?: string;
  rollNo?: string;
}

export function RegistrationRollInfo({
  registrationNo,
  rollNo,
}: RegistrationRollInfoProps) {
  const { colors } = useTheme();

  if (!registrationNo && !rollNo) {
    return null;
  }

  return (
    <View style={styles.regRollContainer}>
      {registrationNo && (
        <View
          style={[
            styles.regRollBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.regRollLabel, { color: colors.textSecondary }]}>
            REGISTRATION
          </Text>
          <Text style={[styles.regRollValue, { color: colors.text }]}>
            {registrationNo}
          </Text>
        </View>
      )}
      {rollNo && (
        <View
          style={[
            styles.regRollBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.regRollLabel, { color: colors.textSecondary }]}>
            UNIV ROLL
          </Text>
          <Text style={[styles.regRollValue, { color: colors.text }]}>
            {rollNo}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  regRollContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  regRollBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  regRollLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  regRollValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
});
