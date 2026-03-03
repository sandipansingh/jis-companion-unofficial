import { FileText } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';

interface Resource {
  filename: string;
  url: string;
}

interface ResourcesCardProps {
  resources: Resource[];
  onResourcePress: (url: string) => void;
}

export function ResourcesCard({ resources, onResourcePress }: ResourcesCardProps) {
  const { colors } = useTheme();

  if (resources.length === 0) return null;

  return (
    <View
      className="bg-surface dark:bg-surface rounded-2xl border border-border p-4 mb-4"
      style={{
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text className="text-[10px] text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-3 font-sans-semi">
        Resources
      </Text>
      <View className="gap-3">
        {resources.map((resource, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center gap-3 bg-ink-100 dark:bg-ink-800 rounded-xl p-3"
            onPress={() => onResourcePress(resource.url)}
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-xl bg-danger-light dark:bg-red-900/30 items-center justify-center">
              <FileText size={18} color={colors.danger} />
            </View>
            <Text
              className="flex-1 text-sm text-ink-900 dark:text-white font-sans-md"
              numberOfLines={1}
            >
              {resource.filename}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
