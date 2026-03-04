import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { Button } from '@/src/components';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { useDevice } from '@/src/hooks/useDevice';

interface DatePickerModalProps {
  visible: boolean;
  date: Date;
  onClose: () => void;
  onChange: (event: any, date?: Date) => void;
  onConfirm: () => void;
}

/** Formats a Date as "YYYY-MM-DD" for an HTML date input value */
function toInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parses "YYYY-MM-DD" string from an HTML input back to a local Date */
function fromInputValue(s: string): Date {
  const [y, mo, d] = s.split('-').map(Number);
  return new Date(y, mo - 1, d);
}

/**
 * Web-only native date input rendered via a real <input type="date">.
 * Never called on Android/iOS.
 */
function WebDateInput({
  value,
  onChange,
  isDark,
}: {
  value: Date;
  onChange: (date: Date) => void;
  isDark: boolean;
}) {
  const { isWeb } = useDevice();
  if (!isWeb) return null;

  return (
    <input
      type="date"
      value={toInputValue(value)}
      onChange={(e) => {
        if (e.target.value) onChange(fromInputValue(e.target.value));
      }}
      style={
        {
          width: '100%',
          padding: '12px 14px',
          fontSize: 15,
          borderRadius: 10,
          border: `1px solid ${isDark ? 'rgba(100,116,139,0.4)' : 'rgba(148,163,184,0.5)'}`,
          background: isDark ? 'rgba(30,37,50,0.9)' : 'rgba(248,250,252,0.9)',
          color: isDark ? '#E2E8F0' : '#1E2235',
          outline: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
          colorScheme: isDark ? 'dark' : 'light',
        } as any
      }
    />
  );
}

export function DatePickerModal({
  visible,
  date,
  onClose,
  onChange,
  onConfirm,
}: DatePickerModalProps) {
  const { isDark, colors } = useTheme();
  const { isDesktopWeb } = useBreakpoint();
  const { isAndroid, isWeb } = useDevice();

  if (isAndroid) {
    return visible ? (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={onChange}
        themeVariant={isDark ? 'dark' : 'light'}
      />
    ) : null;
  }

  // iOS and web use custom modals
  if (isWeb && isDesktopWeb) {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable
          onPress={onClose}
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)' }}
          accessibilityLabel="Close date picker"
        >
          <Pressable onPress={(e) => e.stopPropagation()} className="z-[1]">
            <View
              className="bg-surface rounded-2xl border border-border w-[340px] p-7"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: isDark ? 0.5 : 0.18,
                shadowRadius: 24,
              }}
            >
              <View className="flex-row items-center justify-between mb-5">
                <View className="flex-row items-center gap-2.5">
                  <CalendarDays size={18} color={colors.primary} />
                  <Text className="text-base font-sans-semi text-text">Select Date</Text>
                </View>
              </View>

              <WebDateInput
                value={date}
                onChange={(d) => onChange(null, d)}
                isDark={isDark}
              />

              <View className="flex-row gap-3 mt-5">
                <View className="flex-1">
                  <Button title="Cancel" variant="secondary" onPress={onClose} />
                </View>
                <View className="flex-1">
                  <Button title="Select" onPress={onConfirm} />
                </View>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50 dark:bg-black/[0.65]"
        activeOpacity={1}
        onPress={onClose}
        accessible={true}
        accessibilityLabel="Close date picker"
        accessibilityRole="button"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-surface rounded-t-3xl px-5 pb-8 pt-5"
          style={{
            shadowColor: isDark ? colors.base : colors.text,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.35 : 0.12,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View
            className="w-10 h-1 rounded-full self-center mb-4"
            style={{ backgroundColor: isDark ? colors.textTertiary : colors.border }}
          />

          <Text className="text-xl text-center mb-4 font-display text-text">
            Select Date
          </Text>

          {isWeb ? (
            // Mobile web: HTML date input
            <View className="mb-2">
              <WebDateInput
                value={date}
                onChange={(d) => onChange(null, d)}
                isDark={isDark}
              />
            </View>
          ) : (
            // iOS: native spinner
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
              themeVariant={isDark ? 'dark' : 'light'}
              style={{ height: 200 }}
            />
          )}

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
