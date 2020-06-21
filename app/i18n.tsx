import { Platform } from 'react-native';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import BrowserLanguageDetector from 'i18next-browser-languagedetector';
import * as Localization from 'expo-localization';

//init locales
import locales from './locales.json';

const NativeLanguageDetector = {
	type: 'languageDetector',
	async: true,
	detect: (cb: Function) => {
		cb(Localization.locale);
	},
	init: () => {},
	cacheUserLanguage: () => {},
};

const fallbackLng = 'en';

const LanguageDetector =
	Platform.OS === 'web' ? BrowserLanguageDetector : NativeLanguageDetector;

i18n
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		fallbackLng,
		debug: __DEV__,
		ns: ['common'],
		defaultNS: ['common'],
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
		react: {
			// Turn off the use of React Suspense
			useSuspense: false,
		},
		resources: locales,
	});

export default i18n;
