import { Button } from "@/src/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

interface DatePickerModalProps {
  visible: boolean;
  date: Date;
  onClose: () => void;
  onChange: (event: any, date?: Date) => void;
  onConfirm: () => void;
}

export function DatePickerModal({
  visible,
  date,
  onClose,
  onChange,
  onConfirm,
}: DatePickerModalProps) {
  if (Platform.OS === "android") {
    return visible ? (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={onChange}
      />
    ) : null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(15,23,42,0.5)" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-surface rounded-t-3xl px-5 pb-8 pt-5"
          style={{
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Handle bar */}
          <View className="w-10 h-1 rounded-full bg-ink-300 self-center mb-4" />

          <Text
            className="text-xl text-ink-900 text-center mb-4"
            style={{ fontFamily: "ClashDisplay-Semibold" }}
          >
            Select Date
          </Text>

          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={onChange}
            style={{ height: 200 }}
          />

          <View className="flex-row gap-3 mt-4">
            <View className="flex-1">
              <Button title="Cancel" variant="secondary" onPress={onClose} />
            </View>
            <View className="flex-1">
              <Button title="Select" onPress={onConfirm} />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
