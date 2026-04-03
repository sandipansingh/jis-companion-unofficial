import { AlertCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

export function AppUnavailableScreen() {
  const { colors } = useTheme();

  return (
    <View className="flex-1 bg-base items-center justify-center px-6">
      <View className="items-center max-w-md">
        <AlertCircle size={80} color={colors.danger} strokeWidth={1.5} />
        
        <Text className="text-3xl font-bold text-text mt-6 text-center">
          App No Longer Available
        </Text>
        
        <Text className="text-base text-text-muted mt-4 text-center leading-6">
          This application has been discontinued and is no longer available for use.
        </Text>
        
        <Text className="text-sm text-text-muted mt-6 text-center">
          Thank you for using this unofficial version.
        </Text>
      </View>
    </View>
  );
}
