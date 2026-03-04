import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { TextInput } from '@/src/components';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useDevice } from '@/src/hooks/useDevice';

import { usePyqStore } from '../store/pyqStore';
import { PYQ_FILTER_OPTIONS, PyqSearchFilter } from '../types';

interface PyqSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function PyqSearchBar({ value, onChangeText }: PyqSearchBarProps) {
  const { colors } = useTheme();
  const { isWeb } = useDevice();
  const [showMenu, setShowMenu] = useState(false);
  const [menuLayout, setMenuLayout] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });

  const searchFilter = usePyqStore((state) => state.searchFilter);
  const setSearchFilter = usePyqStore((state) => state.setSearchFilter);

  const btnRef = useRef<View>(null);

  const activeOption =
    PYQ_FILTER_OPTIONS.find((o) => o.value === searchFilter) ?? PYQ_FILTER_OPTIONS[0];

  const openMenu = () => {
    btnRef.current?.measure((_, _2, width, height, pageX, pageY) => {
      const screenWidth = Dimensions.get('window').width;
      setMenuLayout({
        top: pageY + height + 4,
        right: screenWidth - pageX - width,
      });
      setShowMenu(true);
    });
  };

  const handleSelect = (filter: PyqSearchFilter) => {
    setSearchFilter(filter);
    setShowMenu(false);
  };

  return (
    <View className="mx-4 mb-3">
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <TextInput
            icon={Search}
            value={value}
            onChangeText={onChangeText}
            placeholder={activeOption.placeholder}
            disableFocusStyle
          />
        </View>

        <Pressable
          ref={btnRef as any}
          onPress={openMenu}
          className={`h-14 flex-row items-center gap-2 rounded-2xl border px-4 ${
            showMenu
              ? 'bg-surface border-overlay'
              : 'bg-surface border-overlay active:bg-slate-100 dark:active:bg-slate-800'
          }`}
        >
          <SlidersHorizontal size={18} color={colors.textSecondary} />
          <Text
            style={{
              fontSize: 15,
              fontWeight: '500',
              color: colors.textSecondary,
            }}
            numberOfLines={1}
          >
            {activeOption.label}
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback>
              <View
                className="absolute z-[9999] min-w-[170px] rounded-xl border border-overlay bg-surface py-1.5 shadow-modal"
                style={{
                  top: menuLayout.top,
                  right: menuLayout.right,
                  elevation: 10,
                }}
              >
                <Text className="mb-1 border-b border-overlay pb-1.5 pl-3.5 pr-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-700">
                  Filter by
                </Text>

                {PYQ_FILTER_OPTIONS.map((option) => {
                  const isActive = searchFilter === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => handleSelect(option.value)}
                      android_ripple={{ color: 'transparent' }}
                      className={`flex-row items-center justify-between py-3 px-3.5 ${
                        isActive
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : isWeb
                            ? 'bg-transparent active:bg-slate-50 dark:active:bg-slate-900'
                            : 'bg-transparent'
                      }`}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.text,
                          fontWeight: isActive ? '600' : '400',
                          opacity: isActive ? 1 : 0.8,
                        }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
