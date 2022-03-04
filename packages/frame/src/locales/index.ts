import { isBrowser } from '@ty-one-start/utils';
import zhLocal from './zh-CN';
import zhTWLocal from './zh-TW';
import enUSLocal from './en-US';
import itITLocal from './it-IT';
import koKRLocal from './ko-KR';

const locales = {
  'zh-CN': zhLocal,
  'zh-TW': zhTWLocal,
  'en-US': enUSLocal,
  'it-IT': itITLocal,
  'ko-KR': koKRLocal,
};

type GLocaleWindow = {
  g_locale: keyof typeof locales;
};

export type LocaleType = keyof typeof locales;

const getLanguage = (): string => {
  // support ssr
  if (!isBrowser()) return 'zh-CN';
  const lang = window.localStorage.getItem('umi_locale');
  return lang || (window as unknown as GLocaleWindow).g_locale || navigator.language;
};

export { getLanguage };

const gLocaleObject = (): Record<string, string> => {
  const gLocale = getLanguage();
  return locales[gLocale] || locales['zh-CN'];
};

export { gLocaleObject };
