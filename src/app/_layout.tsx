import '../../global.css';

import { AppUnavailableScreen } from '@/src/components';
import { ThemeProvider } from '@/src/contexts/ThemeContext';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  return <AppUnavailableScreen />;
}
