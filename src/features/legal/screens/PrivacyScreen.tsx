import { Linking, Pressable } from 'react-native';

import { LegalPageLayout, LegalSection, LegalText } from '../components';

export default function PrivacyScreen() {
  const openGooglePrivacy = () => {
    Linking.openURL('https://www.google.com/policies/privacy');
  };

  const openExpoPrivacy = () => {
    Linking.openURL('https://expo.dev/privacy');
  };

  const openSupportEmail = () => {
    Linking.openURL('mailto:support@sandipansingh.com');
  };

  return (
    <LegalPageLayout>
      <LegalSection title="Privacy Policy" isHeader>
        <LegalText>
          This Privacy Policy explains how JIS Companion (Unofficial) handles your
          information. This application is an independent, student-developed project
          created by Sandipan Singh and is not affiliated with, endorsed by, or sponsored
          by JIS Group or any institution under JIS Group.
        </LegalText>
      </LegalSection>

      <LegalSection title="Information You Provide">
        <LegalText>
          To access institutional data, you may enter your Student ID and password. These
          credentials are used solely to authenticate directly with official JIS Group API
          endpoints.
        </LegalText>
      </LegalSection>

      <LegalSection title="How Authentication Works">
        <LegalText>
          Credentials are transmitted directly from your device to official JIS Group API
          endpoints. The developer does not operate a custom authentication server and
          does not store credentials on any external system.
        </LegalText>
      </LegalSection>

      <LegalSection title="Local Data Storage (SQLite)">
        <LegalText>
          For offline access and improved performance, selected academic information (such
          as profile details, attendance, and related records) may be stored locally on
          your device using SQLite.
        </LegalText>
        <LegalText>
          This data remains solely on your device. The application does not maintain a
          server-side database or cloud backup of your academic information.
        </LegalText>
      </LegalSection>

      <LegalSection title="Platform Services">
        <LegalText>
          The application does not operate a custom analytics or tracking system. However,
          platform providers such as Google Play Services and Expo infrastructure may
          process limited technical information necessary for app delivery, updates, and
          runtime functionality under their respective privacy policies:
        </LegalText>
        <Pressable onPress={openGooglePrivacy}>
          <LegalText>• Google Play Services Privacy Policy</LegalText>
        </Pressable>
        <Pressable onPress={openExpoPrivacy}>
          <LegalText>• Expo Privacy Policy</LegalText>
        </Pressable>
      </LegalSection>

      <LegalSection title="No Custom Backend or Cloud Storage">
        <LegalText variant="bullet">• No app-managed user accounts</LegalText>
        <LegalText variant="bullet">• No developer-operated server database</LegalText>
        <LegalText variant="bullet">• No cloud storage of academic records</LegalText>
        <LegalText variant="bullet">• No advertisements</LegalText>
      </LegalSection>

      <LegalSection title="Legal Disclosure">
        <LegalText>
          Information may be disclosed if required by law or if necessary to comply with
          legal obligations or protect rights and safety.
        </LegalText>
      </LegalSection>

      <LegalSection title="Data Retention and Deletion">
        <LegalText>
          Locally stored app data remains on your device until removed by uninstalling the
          application or clearing app storage through device settings. Institutional
          academic records are controlled by official systems of institutions under JIS
          Group and cannot be deleted through this app.
        </LegalText>
      </LegalSection>

      <LegalSection title="Security">
        <LegalText>
          Reasonable care has been taken in designing the application. Authentication and
          institutional records are managed by external systems governed by their
          respective providers.
        </LegalText>
      </LegalSection>

      <LegalSection title="Children's Privacy">
        <LegalText>This application is not directed to children under 13.</LegalText>
      </LegalSection>

      <LegalSection title="Policy Updates">
        <LegalText>
          This Privacy Policy may be updated periodically. Changes become effective when
          the updated version is published within the application.
        </LegalText>
      </LegalSection>

      <LegalSection title="Your Consent">
        <LegalText>
          By using this application, you consent to the handling of information as
          described in this Privacy Policy.
        </LegalText>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalText>For privacy-related questions, contact:</LegalText>
        <Pressable onPress={openSupportEmail}>
          <LegalText>support@sandipansingh.com</LegalText>
        </Pressable>
      </LegalSection>
    </LegalPageLayout>
  );
}
