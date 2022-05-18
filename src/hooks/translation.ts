
import { useState } from 'react';
import { config } from 'src/config';
import { safeLsGet, safeLsSet } from 'src/utils/safeLS';

const languages = config.supportedLocales.map(el => {
  return {
    [el.key] : require(`./assets/locales/${el.key}.json`),
  }
}).reduce((result, current) => {
  return Object.assign(result, current);
}, {});

const defaultLanguage = config.defaultLanguage;
const translations: { [lang: string]: { [name: string]: string } } = {
  ...languages,
};

function getInitialLanguage(): string {
  const savedLanguage = safeLsGet('selectedLanguage');

  if (savedLanguage && translations[savedLanguage]) {
    return savedLanguage;
  }

  if (navigator.language) {
    if (translations[navigator.language]) {
      return navigator.language;
    }

    const langPart = navigator.language.split('-')[0];
    if (translations[langPart]) {
      return langPart;
    }
  }

  if (navigator.languages) {
    for (const lang of navigator.languages) {
      if (translations[lang]) {
        return lang;
      }

      const langPart = lang.split('-')[0];
      if (translations[langPart]) {
        return langPart;
      }
    }
  }

  return defaultLanguage;
}
function checkTranslations() {
  const keys: { [key: string]: boolean } = {};

  for (const lang in translations) {
    for (const name in translations[lang]) {
      keys[name] = true;
    }
  }

  for (const lang in translations) {
    for (const key in keys) {
      if (!translations[lang][key]) {
        console.warn(`Language '${lang}' does not have translation for key: '${key}'`);
      }
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  checkTranslations();
}

export function useTranslation() {
  const [selectedLanguage, setSelectedLanguage] = useState(getInitialLanguage());

  const t = (name: string, values?: { [key: string]: string }) => {
    const template = translations[selectedLanguage][name];

    if (!template) {
      return '';
    }

    const v = values ?? {};
    const r = Object.keys(v).reduce((acc, k) => acc.replace(`{${k}}`, v[k]), template);

    return r;
  };

  const setLanguage = (newLang: string) => {
    if (!translations[newLang]) {
      return;
    }

    safeLsSet('selectedLanguage', newLang);
    setSelectedLanguage(newLang);
  };

  return {
    t,
    selectedLanguage,
    setLanguage,
  };
}