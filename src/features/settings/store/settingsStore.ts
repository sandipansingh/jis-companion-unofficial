import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FeesViewMode = 'college' | 'simplified';

interface SettingsState {
  theme: 'light' | 'dark';
  feesViewMode: FeesViewMode;
  shareProfilePic: boolean;
  shareCollege: boolean;
  shareContact: boolean;
  shareSocial: boolean;
  hasReadVideoByteGuidelines: boolean;
  setTheme: (value: 'light' | 'dark') => void;
  setFeesViewMode: (value: FeesViewMode) => void;
  setShareProfilePic: (value: boolean) => void;
  setShareCollege: (value: boolean) => void;
  setShareContact: (value: boolean) => void;
  setShareSocial: (value: boolean) => void;
  setHasReadVideoByteGuidelines: (value: boolean) => void;
}

type PersistedSettingsState = Pick<
  SettingsState,
  | 'theme'
  | 'feesViewMode'
  | 'shareProfilePic'
  | 'shareCollege'
  | 'shareContact'
  | 'shareSocial'
  | 'hasReadVideoByteGuidelines'
>;

const defaultPersistedSettings: PersistedSettingsState = {
  theme: 'light',
  feesViewMode: 'simplified',
  shareProfilePic: true,
  shareCollege: true,
  shareContact: true,
  shareSocial: true,
  hasReadVideoByteGuidelines: false,
};

const migrateSettings = (
  persistedState: unknown,
  version: number,
): PersistedSettingsState => {
  const state = (persistedState ?? {}) as Partial<PersistedSettingsState>;

  switch (version) {
    case 0:
    case 1:
    case 2:
    case 3:
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
      theme: 'light',
      feesViewMode: 'college',
      shareProfilePic: true,
      shareCollege: true,
      shareContact: true,
      shareSocial: true,
      hasReadVideoByteGuidelines: false,
      setTheme: (value) => set({ theme: value }),
      setFeesViewMode: (value) => set({ feesViewMode: value }),
      setShareProfilePic: (value) => set({ shareProfilePic: value }),
      setShareCollege: (value) => set({ shareCollege: value }),
      setShareContact: (value) => set({ shareContact: value }),
      setShareSocial: (value) => set({ shareSocial: value }),
      setHasReadVideoByteGuidelines: (value) =>
        set({ hasReadVideoByteGuidelines: value }),
    }),
    {
      name: 'user-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 3,
      migrate: migrateSettings,
      onRehydrateStorage: () => async (state) => {
        if (!state) return;
        try {
          const stored = await AsyncStorage.getItem('user-settings-storage');
          if (!stored) {
            useSettingsStore.setState({ ...defaultPersistedSettings });
          }
        } catch {
          // ignore storage errors
        }
      },
    },
  ),
);
