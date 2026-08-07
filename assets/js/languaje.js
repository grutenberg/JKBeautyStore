/*
	Add a data-i18n="section.key" attribute to any future text that should be
	translated, then define the matching key in each language below.
*/
(function () {
	'use strict';

	var defaultLanguage = 'es';
	var languageOrder = ['es', 'pt', 'en'];
	var storageKey = 'jk-beauty-language';
	var languageNames = {
		es: 'Español',
		pt: 'Português',
		en: 'English'
	};
	var translations = {
		es: {
			hero: {
				titlePrefix: 'Somos'
			}
		},
		pt: {
			hero: {
				titlePrefix: 'Somos a'
			}
		},
		en: {
			hero: {
				titlePrefix: 'We are'
			}
		}
	};

	function isSupportedLanguage(language) {
		return languageOrder.indexOf(language) !== -1;
	}

	function getStoredLanguage() {
		try {
			var storedLanguage = window.localStorage.getItem(storageKey);
			return isSupportedLanguage(storedLanguage) ? storedLanguage : defaultLanguage;
		} catch (error) {
			return defaultLanguage;
		}
	}

	function getTranslation(language, key) {
		var value = translations[language];
		var keyParts = key.split('.');

		for (var index = 0; index < keyParts.length && value; index += 1) {
			value = value[keyParts[index]];
		}

		return typeof value === 'string' ? value : null;
	}

	function updateLanguageSwitcher(language) {
		var switcher = document.getElementById('language-switcher');

		if (!switcher) {
			return;
		}

		switcher.textContent = language.toUpperCase();
		switcher.setAttribute('aria-label', 'Cambiar idioma. Idioma actual: ' + languageNames[language]);
		switcher.title = 'Cambiar idioma';
	}

	function translatePage(language) {
		var elements = document.querySelectorAll('[data-i18n]');

		elements.forEach(function (element) {
			var key = element.getAttribute('data-i18n');
			var translation = getTranslation(language, key) || getTranslation(defaultLanguage, key);

			if (translation) {
				element.textContent = translation;
			}
		});

		document.documentElement.lang = language;
		updateLanguageSwitcher(language);
	}

	function setLanguage(language) {
		var selectedLanguage = isSupportedLanguage(language) ? language : defaultLanguage;

		translatePage(selectedLanguage);

		try {
			window.localStorage.setItem(storageKey, selectedLanguage);
		} catch (error) {
			// The page remains usable when storage is blocked by the browser.
		}
	}

	function setUpLanguageSwitcher() {
		var switcher = document.getElementById('language-switcher');
		var currentLanguage = getStoredLanguage();

		setLanguage(currentLanguage);

		if (!switcher) {
			return;
		}

		switcher.addEventListener('click', function () {
			var currentIndex = languageOrder.indexOf(document.documentElement.lang);
			var nextLanguage = languageOrder[(currentIndex + 1) % languageOrder.length];

			setLanguage(nextLanguage);
		});
	}

	setUpLanguageSwitcher();
})();
