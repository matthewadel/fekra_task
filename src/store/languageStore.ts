import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

export interface LanguageState {
  currentLanguage: string;
  hasHydrated: boolean;
  setLanguage: (language: string) => Promise<void>;
  initializeLanguage: () => Promise<void>;
  toggleHydrateState: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      hasHydrated: false,

      toggleHydrateState: () => set({ hasHydrated: true }),

      setLanguage: async (language: string) => {
        try {
          set({ currentLanguage: language });
          await i18n.changeLanguage(language);
        } catch (error) {
          console.error(error);
        }
      },

      initializeLanguage: async () => {
        try {
          const storedLanguage = get().currentLanguage;
          await i18n.changeLanguage(storedLanguage);
        } catch (error) {
          console.error(error);
          await i18n.changeLanguage('en');
        }
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        currentLanguage: state.currentLanguage,
      }),
      onRehydrateStorage: () => state => {
        if (state) useLanguageStore.getState().toggleHydrateState();
      },
    },
  ),
);
