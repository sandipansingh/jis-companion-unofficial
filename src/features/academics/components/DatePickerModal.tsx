import { Button, Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Platform, StyleSheet, TouchableOpacity } from "react-native";

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
  const { colors } = useTheme();

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
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.content,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Select Date
            </Text>
          </View>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={onChange}
            textColor={colors.text}
            style={{ height: 200 }}
          />
          <View style={styles.buttons}>
            <View style={{ flex: 1, backgroundColor: "transparent" }}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={onClose}
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: colors.border,
                  height: 48,
                }}
                textStyle={{
                  fontSize: 16,
                  color: colors.text,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Select"
                onPress={onConfirm}
                style={{
                  height: 48,
                }}
                textStyle={{
                  fontSize: 16,
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    backgroundColor: "transparent",
  },
});
