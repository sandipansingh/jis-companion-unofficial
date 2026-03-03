import { CreditCard, FileText, Landmark, MapPin } from 'lucide-react-native';
import { View } from 'react-native';

import { InfoRow } from '@/src/components';

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
    <View>
      <InfoRow label="ACCOUNT NUMBER" value={accountNumber} icon={CreditCard} />
      <InfoRow label="BANK NAME" value={bankName} icon={Landmark} />
      <InfoRow label="BRANCH NAME" value={branchName} icon={MapPin} />
      <InfoRow label="IFSC CODE" value={ifscCode} icon={FileText} isLast />
    </View>
  );
}
