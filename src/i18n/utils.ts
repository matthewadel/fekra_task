import i18n from 'i18next';
import { useLanguageStore } from '../store';

export const changeLanguage = async (language: string) => {
  // Use Zustand store to change language (which will also update i18n)

  i18n.language = language;
  const { setLanguage } = useLanguageStore.getState();
  await setLanguage(language);
};
