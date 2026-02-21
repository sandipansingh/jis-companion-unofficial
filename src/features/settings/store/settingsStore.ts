import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  theme: "light" | "dark";
  shareProfilePic: boolean;
  shareCollege: boolean;
  shareContact: boolean;
  shareSocial: boolean;
  setTheme: (value: "light" | "dark") => void;
  setShareProfilePic: (value: boolean) => void;
  setShareCollege: (value: boolean) => void;
  setShareContact: (value: boolean) => void;
  setShareSocial: (value: boolean) => void;
}

type PersistedSettingsState = Pick<
  SettingsState,
  "theme" | "shareProfilePic" | "shareCollege" | "shareContact" | "shareSocial"
>;

const defaultPersistedSettings: PersistedSettingsState = {
  theme: "light",
  shareProfilePic: true,
  shareCollege: true,
  shareContact: true,
  shareSocial: true,
};

const migrateSettings = (
  persistedState: unknown,
  version: number
): PersistedSettingsState => {
  const state = (persistedState ?? {}) as Partial<PersistedSettingsState>;

  switch (version) {
    case 0:
    case 1:
      return {
        ...defaultPersistedSettings,
        ...state,
      };
    default:
      return {
        ...defaultPersistedSettings,
        ...state,
      };
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      shareProfilePic: true,
      shareCollege: true,
      shareContact: true,
      shareSocial: true,
      setTheme: (value) => set({ theme: value }),
      setShareProfilePic: (value) => set({ shareProfilePic: value }),
      setShareCollege: (value) => set({ shareCollege: value }),
      setShareContact: (value) => set({ shareContact: value }),
      setShareSocial: (value) => set({ shareSocial: value }),
    }),
    {
      name: "user-settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: migrateSettings,
    }
  )
);
