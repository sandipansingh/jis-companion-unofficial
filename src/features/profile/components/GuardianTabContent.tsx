import { InfoRow } from "@/src/components";
import { Mail, MapPin, Phone, User } from "lucide-react-native";
import { View } from "react-native";

interface GuardianTabContentProps {
  guardianName?: string;
  guardianMobile1?: string;
  guardianMobile2?: string;
  guardianEmail1?: string;
  guardianEmail2?: string;
  guardianAddress?: string;
}

export function GuardianTabContent({
  guardianName,
  guardianMobile1,
  guardianMobile2,
  guardianEmail1,
  guardianEmail2,
  guardianAddress,
}: GuardianTabContentProps) {
  const mobileValue =
    guardianMobile1 && guardianMobile2
      ? guardianMobile1 + " | " + guardianMobile2
      : guardianMobile1 || guardianMobile2;

  const emailValue =
    guardianEmail1 && guardianEmail2
      ? guardianEmail1 + " | " + guardianEmail2
      : guardianEmail1 || guardianEmail2;

  return (
    <View>
      <InfoRow label="GUARDIAN NAME" value={guardianName} icon={User} />
      <InfoRow label="GUARDIAN MOBILE" value={mobileValue} icon={Phone} />
      <InfoRow label="GUARDIAN EMAIL" value={emailValue} icon={Mail} />
      <InfoRow
        label="GUARDIAN ADDRESS"
        value={guardianAddress}
        icon={MapPin}
        isLast
      />
    </View>
  );
}
