import { useTheme } from "@/src/contexts/ThemeContext";
import { Check, ChevronDown } from "lucide-react-native";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
  const { isDark } = useTheme();

  return (
    <>
      <View className="mb-5">
        <Text
          className="text-xs text-ink-500 dark:text-ink-400 mb-2 ml-1 tracking-widest uppercase"
          style={{ fontFamily: "GeneralSans-Semibold" }}
        >
          {label}
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-between bg-surface dark:bg-ink-900 border border-border rounded-xl px-3.5 py-3.5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 2,
            elevation: 1,
          }}
          onPress={onOpen}
        >
          <Text
            className={
              value
                ? "text-ink-900 dark:text-ink-100 text-sm"
                : "text-ink-400 dark:text-ink-500 text-sm"
            }
            style={{ fontFamily: "GeneralSans-Medium" }}
          >
            {value || placeholder}
          </Text>
          <ChevronDown size={18} color={isDark ? "#94A3B8" : "#64748B"} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center px-5"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            className="w-full bg-surface dark:bg-ink-900 rounded-2xl overflow-hidden"
            style={{
              maxHeight: "70%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <ScrollView style={{ maxHeight: 400 }}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  className="flex-row items-center justify-between px-4 py-4"
                  style={{
                    borderBottomWidth: index === options.length - 1 ? 0 : 1,
                    borderBottomColor: isDark ? "#334155" : "#CBD5E1",
                    backgroundColor:
                      value === option.label
                        ? isDark
                          ? "#1F2937"
                          : "#EEF3FF"
                        : "transparent",
                  }}
                  onPress={() => onSelect(option.value)}
                >
                  <Text
                    className="text-ink-900 dark:text-ink-100 text-base"
                    style={{ fontFamily: "GeneralSans-Medium" }}
                  >
                    {option.label}
                  </Text>
                  {value === option.label && (
                    <Check size={16} color="#2B5BDB" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
