import { Check } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
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

export function FilterDropdown({ selectedField, onSelectField }: FilterDropdownProps) {
  return (
    <View
      className="bg-surface dark:bg-ink-900 rounded-2xl overflow-hidden"
      style={{
        zIndex: 1000,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {FILTER_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.field}
          className={`flex-row items-center px-4 py-3.5 gap-3 ${
            selectedField === option.field
              ? "bg-cobalt-50 dark:bg-ink-800"
              : ""
          }`}
          onPress={() => onSelectField(option.field)}
          activeOpacity={0.7}
        >
          <Text
            className={`flex-1 text-sm ${
              selectedField === option.field
                ? "text-cobalt-700 dark:text-white"
                : "text-ink-800 dark:text-ink-300"
            }`}
            style={{ fontFamily: selectedField === option.field ? "GeneralSans-Semibold" : "GeneralSans-Regular" }}
          >
            {option.label}
          </Text>
          {selectedField === option.field && <Check size={16} color="#2B5BDB" />}
        </TouchableOpacity>
      ))}
    </View>
  );
}
