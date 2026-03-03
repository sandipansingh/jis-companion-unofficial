import { ChevronDown } from 'lucide-react-native';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { getTabIndicatorColor, getTabLabelColor } from '@/src/constants/tabColors';
import { useTheme } from '@/src/contexts/ThemeContext';

interface DropdownOption {
  label: string;
  value: string;
}

interface CourseDropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: DropdownOption[];
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
}

export function CourseDropdown({
  label,
  value,
  placeholder,
  options,
  visible,
  onOpen,
  onClose,
  onSelect,
}: CourseDropdownProps) {
  const { isDark, colors } = useTheme();

  return (
    <>
      <View className="mb-5">
        <Text className="text-xs text-ink-500 dark:text-ink-400 mb-2 ml-1 tracking-widest uppercase font-sans-semi">
          {label}
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-between bg-surface dark:bg-surface border border-border rounded-xl px-3.5 py-3.5"
          style={{
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
          onPress={onOpen}
        >
          <Text
            className={`text-sm font-sans-md ${
              value ? 'text-ink-900 dark:text-ink-100' : 'text-ink-400 dark:text-ink-500'
            }`}
          >
            {value || placeholder}
          </Text>
          <ChevronDown size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <TouchableOpacity
          className="flex-1 justify-center items-center px-5 bg-black/50"
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            className="w-full rounded-2xl overflow-hidden max-h-[70%]"
            style={{
              backgroundColor: colors.overlay,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <ScrollView className="max-h-[400px]">
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  className="flex-row items-center px-4 py-4"
                  style={{
                    borderBottomWidth: index === options.length - 1 ? 0 : 1,
                    borderBottomColor: colors.border,
                    borderLeftWidth: 3,
                    borderLeftColor:
                      value === option.value
                        ? getTabLabelColor(isDark, true)
                        : 'transparent',
                    backgroundColor:
                      value === option.value
                        ? getTabIndicatorColor(isDark)
                        : colors.surface,
                  }}
                  onPress={() => onSelect(option.value)}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily:
                        value === option.value ? 'Inter_600SemiBold' : 'Inter_400Regular',
                      color:
                        value === option.value
                          ? getTabLabelColor(isDark, true)
                          : colors.text,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
