import { Button, InfoRow, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  Calendar,
  Droplet,
  Lock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react-native";
import { StyleSheet } from "react-native";

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

      <Button
        title="Change Password"
        onPress={onChangePassword}
        icon={<Lock size={16} color={colors.white} />}
        iconPosition="left"
        style={{
          marginTop: 24,
          height: 50,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContentInner: {
    backgroundColor: "transparent",
  },
});
