import { Platform } from "react-native";
import { create } from "zustand";

interface SafeAreaStore {
  bottomInset: number;
  topInset: number;
  leftInset: number;
  rightInset: number;
  bottomOffset: number;
  setInsets: (insets: {
    bottom: number;
    top: number;
    left: number;
    right: number;
  }) => void;
}

export const useSafeAreaStore = create<SafeAreaStore>((set) => ({
  bottomInset: 0,
  topInset: 0,
  leftInset: 0,
  rightInset: 0,
  bottomOffset: 16,
  setInsets: (insets) =>
    set((state) => {
      if (Platform.OS === "ios") {
        return {
          bottomInset: 0,
          topInset: 0,
          leftInset: 0,
          rightInset: 0,
          bottomOffset: 16,
        };
      }

      return {
        bottomInset: insets.bottom,
        topInset: insets.top,
        leftInset: insets.left,
        rightInset: insets.right,
        bottomOffset: insets.bottom > 0 ? insets.bottom + 8 : 16,
      };
    }),
}));
