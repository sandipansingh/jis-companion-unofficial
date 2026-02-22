import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  theme: "light" | "dark";
  shareProfilePic: boolean;
  shareCollege: boolean;
  shareContact: boolean;
  shareSocial: boolean;
  hasReadVideoByteGuidelines: boolean;
  setTheme: (value: "light" | "dark") => void;
  setShareProfilePic: (value: boolean) => void;
  setShareCollege: (value: boolean) => void;
  setShareContact: (value: boolean) => void;
  setShareSocial: (value: boolean) => void;
  setHasReadVideoByteGuidelines: (value: boolean) => void;
}

type PersistedSettingsState = Pick<
  SettingsState,
  "theme" | "shareProfilePic" | "shareCollege" | "shareContact" | "shareSocial" | "hasReadVideoByteGuidelines"
>;

const defaultPersistedSettings: PersistedSettingsState = {
  theme: "light",
  shareProfilePic: true,
  shareCollege: true,
  shareContact: true,
  shareSocial: true,
  hasReadVideoByteGuidelines: false,
};

const migrateSettings = (
  persistedState: unknown,
  version: number
): PersistedSettingsState => {
  const state = (persistedState ?? {}) as Partial<PersistedSettingsState>;

  switch (version) {
    case 0:
    case 1:
    case 2:
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
      hasReadVideoByteGuidelines: false,
      setTheme: (value) => set({ theme: value }),
      setShareProfilePic: (value) => set({ shareProfilePic: value }),
      setShareCollege: (value) => set({ shareCollege: value }),
      setShareContact: (value) => set({ shareContact: value }),
      setShareSocial: (value) => set({ shareSocial: value }),
      setHasReadVideoByteGuidelines: (value) => set({ hasReadVideoByteGuidelines: value }),
    }),
    {
      name: "user-settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: migrateSettings,
    }
  )
);
