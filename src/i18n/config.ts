import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fa from './fa.json';
import en from './en.json';

const savedLang = localStorage.getItem('language') || 'fa';

i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: fa },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'fa',
  interpolation: {
    escapeValue: false,
  },
});

export function changeLanguage(lang: 'fa' | 'en') {
  i18n.changeLanguage(lang);
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
}

export default i18n;
