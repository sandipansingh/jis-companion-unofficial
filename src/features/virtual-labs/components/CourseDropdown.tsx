import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ChevronDown } from "lucide-react-native";
import { Modal, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

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
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={onOpen}
        >
          <Text
            style={[
              styles.dropdownText,
              {
                color: value ? colors.text : colors.textSecondary,
              },
            ]}
          >
            {value || placeholder}
          </Text>
          <ChevronDown size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={[
              styles.dropdownContent,
              { backgroundColor: colors.surface },
            ]}
          >
            <ScrollView style={styles.dropdownScroll}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: index === options.length - 1 ? 0 : 1,
                    },
                  ]}
                  onPress={() => onSelect(option.value)}
                >
                  <Text
                    style={[styles.dropdownItemText, { color: colors.text }]}
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

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dropdownContent: {
    width: "100%",
    maxHeight: "70%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  dropdownScroll: {
    maxHeight: 400,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
