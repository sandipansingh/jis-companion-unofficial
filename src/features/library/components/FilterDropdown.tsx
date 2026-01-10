import { useTheme } from "@/src/contexts/ThemeContext";
import { Check } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LibrarySearchField } from "../api";

interface FilterDropdownProps {
  selectedField: LibrarySearchField;
  onSelectField: (field: LibrarySearchField) => void;
}

const FILTER_OPTIONS = [
  { field: "acc_title" as LibrarySearchField, label: "Title" },
  { field: "acc_author_name" as LibrarySearchField, label: "Author" },
  { field: "acc_call" as LibrarySearchField, label: "Call No" },
  { field: "acc_isbn" as LibrarySearchField, label: "ISBN" },
];

export function FilterDropdown({
  selectedField,
  onSelectField,
}: FilterDropdownProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.filterDropdown, { backgroundColor: colors.surface }]}>
      {FILTER_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.field}
          style={[
            styles.dropdownItem,
            selectedField === option.field && {
              backgroundColor: colors.primary + "10",
            },
          ]}
          onPress={() => onSelectField(option.field)}
        >
          <Text style={[styles.dropdownItemText, { color: colors.text }]}>
            {option.label}
          </Text>
          {selectedField === option.field && (
            <Check size={18} color={colors.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filterDropdown: {
    position: "absolute",
    top: 55,
    right: 0,
    zIndex: 1000,
    borderRadius: 16,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
});
