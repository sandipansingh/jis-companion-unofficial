import { InfoRow, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  Calendar,
  Droplet,
  Lock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface PersonalTabContentProps {
  email?: string;
  mobile?: string;
  dob?: string;
  bloodGroup?: string;
  presentAddress?: string;
  presentCity?: string;
  presentPin?: string;
  permanentAddress?: string;
  permanentCity?: string;
  permanentPin?: string;
  onChangePassword: () => void;
}

export function PersonalTabContent({
  email,
  mobile,
  dob,
  bloodGroup,
  presentAddress,
  presentCity,
  presentPin,
  permanentAddress,
  permanentCity,
  permanentPin,
  onChangePassword,
}: PersonalTabContentProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.tabContentInner}>
      <InfoRow label="EMAIL ADDRESS" value={email} icon={Mail} />
      <InfoRow label="MOBILE NUMBER" value={mobile} icon={Phone} />
      <InfoRow label="DATE OF BIRTH" value={dob} icon={Calendar} />
      <InfoRow label="BLOOD GROUP" value={bloodGroup} icon={Droplet} />
      <InfoRow
        label="PRESENT ADDRESS"
        value={
          presentAddress
            ? `${presentAddress}, ${presentCity} - ${presentPin}`
            : undefined
        }
        icon={MapPin}
      />
      <InfoRow
        label="PERMANENT ADDRESS"
        value={
          permanentAddress
            ? `${permanentAddress}, ${permanentCity} - ${permanentPin}`
            : undefined
        }
        icon={MapPin}
        isLast
      />

      <TouchableOpacity
        style={[
          styles.changePasswordButton,
          { backgroundColor: colors.primary },
        ]}
        onPress={onChangePassword}
      >
        <Lock size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.changePasswordButtonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContentInner: {
    backgroundColor: "transparent",
  },
  changePasswordButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  changePasswordButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
