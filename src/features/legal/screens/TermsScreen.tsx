import { Linking, Pressable } from 'react-native';

import { LegalPageLayout, LegalSection, LegalText } from '../components';

export default function TermsScreen() {
  const openSupportEmail = () => {
    Linking.openURL('mailto:support@sandipansingh.com');
  };

  return (
    <LegalPageLayout>
      <LegalSection title="Terms of Service" isHeader>
        <LegalText>
          These Terms of Service govern your use of JIS Companion (Unofficial). By using
          this app, you agree to these terms.
        </LegalText>
      </LegalSection>

      <LegalSection title="Unofficial Status">
        <LegalText>
          JIS Companion (Unofficial) is an independent student-developed application by
          Sandipan Singh.
        </LegalText>
        <LegalText>
          It is not affiliated with, endorsed by, or sponsored by JIS Group or any
          institution under JIS Group.
        </LegalText>
      </LegalSection>

      <LegalSection title="Service Scope">
        <LegalText>
          The app is provided for convenience and displays information retrieved from
          official APIs of institutions under JIS Group on your device.
        </LegalText>
        <LegalText>
          The app does not create, modify, or control institutional records, academic
          outcomes, fees, attendance status, or official decisions.
        </LegalText>
      </LegalSection>

      <LegalSection title="User Responsibilities">
        <LegalText variant="bullet">
          • Keep your Student ID and password confidential
        </LegalText>
        <LegalText variant="bullet">
          • Use the app lawfully and in compliance with institutional rules
        </LegalText>
        <LegalText variant="bullet">
          • Verify critical information through official channels of institutions under
          JIS Group
        </LegalText>
      </LegalSection>

      <LegalSection title="Disclaimer of Accuracy and Availability">
        <LegalText>
          Information shown in the app may be delayed, incomplete, unavailable, or
          inaccurate due to upstream API issues, network interruptions, or source data
          errors.
        </LegalText>
        <LegalText>
          Access to the app may be interrupted or unavailable at any time, including due
          to API downtime or platform limitations.
        </LegalText>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <LegalText>
          To the maximum extent permitted by law, the developer is not liable for any
          direct, indirect, incidental, special, consequential, or punitive damages
          arising from your use of or inability to use the app.
        </LegalText>
        <LegalText variant="bullet">• API downtime or service interruptions</LegalText>
        <LegalText variant="bullet">
          • Incorrect, outdated, or incomplete academic data
        </LegalText>
        <LegalText variant="bullet">
          • Academic, financial, or personal decisions made using app-displayed data
        </LegalText>
        <LegalText variant="bullet">
          • Data loss resulting from uninstalling the app, clearing storage, device reset,
          or device failure
        </LegalText>
      </LegalSection>

      <LegalSection title="Changes and Discontinuation">
        <LegalText>
          The developer may modify, suspend, or discontinue any part of the app at any
          time without prior notice.
        </LegalText>
        <LegalText>
          Continued use after updates to these terms constitutes acceptance of the revised
          terms.
        </LegalText>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalText>For questions regarding these terms, contact:</LegalText>
        <Pressable onPress={openSupportEmail}>
          <LegalText>support@sandipansingh.com</LegalText>
        </Pressable>
      </LegalSection>
    </LegalPageLayout>
  );
}
