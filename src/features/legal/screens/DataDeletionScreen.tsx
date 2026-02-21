import { Linking, Pressable } from 'react-native';
import { LegalPageLayout, LegalSection, LegalText } from "../components";

export default function DataDeletionScreen() {
  const openSupportEmail = () => {
    Linking.openURL('mailto:support@sandipansingh.com');
  };

  return (
    <LegalPageLayout>
      <LegalSection title="Data Deletion" isHeader>
        <LegalText>
          This page explains how data deletion works for JIS Companion (Unofficial).
        </LegalText>
      </LegalSection>

      <LegalSection title="No App-Managed Accounts">
        <LegalText>
          This app does not create or manage institutional user accounts. Your institutional account is managed by official systems of institutions under JIS Group.
        </LegalText>
      </LegalSection>

      <LegalSection title="Where Data Is Stored">
        <LegalText>
          App data used for convenience and offline access is stored locally on your device (including local SQLite storage).
        </LegalText>
        <LegalText>
          The app does not maintain a custom backend database or cloud storage for your personal academic records.
        </LegalText>
      </LegalSection>

      <LegalSection title="How to Delete App Data">
        <LegalText variant="bullet">• Uninstall the app from your device</LegalText>
        <LegalText variant="bullet">• Or clear the app's storage/data from device settings</LegalText>
        <LegalText>
          Either action removes locally stored app data from your device, subject to your device and operating system behavior.
        </LegalText>
      </LegalSection>

      <LegalSection title="Institutional Record Deletion">
        <LegalText>
          If you want to delete or modify institutional records held by JIS Group or any institution under JIS Group, you must contact the relevant institution directly through official channels.
        </LegalText>
        <LegalText>
          This app cannot delete, alter, or request deletion of records stored by official systems of institutions under JIS Group.
        </LegalText>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalText>For questions about app data handling, contact:</LegalText>
        <Pressable onPress={openSupportEmail}>
          <LegalText>support@sandipansingh.com</LegalText>
        </Pressable>
      </LegalSection>
    </LegalPageLayout>
  );
}
