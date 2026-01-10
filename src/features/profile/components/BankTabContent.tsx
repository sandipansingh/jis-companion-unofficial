import { InfoRow, View } from "@/src/components";
import { CreditCard, FileText, Landmark, MapPin } from "lucide-react-native";
import { StyleSheet } from "react-native";

interface BankTabContentProps {
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
  ifscCode?: string;
}

export function BankTabContent({
  accountNumber,
  bankName,
  branchName,
  ifscCode,
}: BankTabContentProps) {
  return (
    <View style={styles.tabContentInner}>
      <InfoRow label="ACCOUNT NUMBER" value={accountNumber} icon={CreditCard} />
      <InfoRow label="BANK NAME" value={bankName} icon={Landmark} />
      <InfoRow label="BRANCH NAME" value={branchName} icon={MapPin} />
      <InfoRow label="IFSC CODE" value={ifscCode} icon={FileText} isLast />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContentInner: {
    backgroundColor: "transparent",
  },
});
