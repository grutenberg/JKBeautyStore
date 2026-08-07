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

    var languageFlags = {
        es: '🇦🇷',
        pt: '🇧🇷',
        en: '🇺🇸'
    };
	var translations = {
		es: {
			nav: {
				home: 'Inicio',
				services: 'Servicios',
				contact: 'Contacto'
			},
			hero: {
				titlePrefix: 'Somos',
				tagline: 'Tu lugar de',
				services: '✨ Uñas, Cejas & Masajes',
				wellbeing: '💖 Belleza y bienestar en un solo lugar',
				contactButton: 'Contactanos'
			},
			services: {
				title: 'Lo que hacemos.',
				description: 'Cubrimos un amplio rango de servicios para tu belleza y bienestar',
				manicure: 'Manicuría',
				massage: 'Masajes',
				lashing: 'Lashista y Cejas'
			},
			manicure: {
				title: 'Nuestras Opciones de Manicuría'
			},
			massage: {
				title: 'Nuestras Opciones de Masajes'
			},
			lashing: {
				title: 'Nuestras Opciones de Lashing/Cejas'
			},
			contact: {
				title: 'Contactanos.',
				description: 'Estamos aca para ayudarte con tus necesidades, no dudes en mandarnos un mensaje!',
				findUs: 'Encuéntranos en...'
			},
			footer: {
				copyright: '@grutenberg. Todos los derechos reservados.',
				design: 'Diseño:'
			},
            options: {}
		},
		pt: {
			nav: {
				home: 'Início',
				services: 'Serviços',
				contact: 'Contato'
			},
			hero: {
				titlePrefix: 'Somos a',
				tagline: 'O seu espaço para',
				services: '✨ Unhas, Sobrancelhas & Massagens',
				wellbeing: '💖 Beleza e bem-estar em um só lugar',
				contactButton: 'Entre em contato'
			},
			services: {
				title: 'O que fazemos.',
				description: 'Oferecemos uma ampla variedade de serviços para sua beleza e bem-estar',
				manicure: 'Manicure',
				massage: 'Massagens',
				lashing: 'Cílios e Sobrancelhas'
			},
			manicure: {
				title: 'Nossas Opções de Manicure'
			},
			massage: {
				title: 'Nossas Opções de Massagens'
			},
			lashing: {
				title: 'Nossas Opções de Cílios e Sobrancelhas'
			},
			contact: {
				title: 'Fale conosco.',
				description: 'Estamos aqui para ajudar com suas necessidades. Não hesite em nos enviar uma mensagem!',
				findUs: 'Encontre-nos em...'
			},
			footer: {
				copyright: '@grutenberg. Todos os direitos reservados.',
				design: 'Design:'
			},
            options: {}
		},
		en: {
			nav: {
				home: 'Home',
				services: 'Services',
				contact: 'Contact'
			},
			hero: {
				titlePrefix: 'We are',
				tagline: 'Your place for',
				services: '✨ Nails, Brows & Massages',
				wellbeing: '💖 Beauty and well-being in one place',
				contactButton: 'Contact us'
			},
			services: {
				title: 'What we do.',
				description: 'We offer a wide range of services for your beauty and well-being',
				manicure: 'Manicures',
				massage: 'Massages',
				lashing: 'Lashes and Brows'
			},
			manicure: {
				title: 'Our Manicure Options'
			},
			massage: {
				title: 'Our Massage Options'
			},
			lashing: {
				title: 'Our Lash and Brow Options'
			},
			contact: {
				title: 'Contact us.',
				description: 'We are here to help with your needs. Do not hesitate to send us a message!',
				findUs: 'Find us on...'
			},
			footer: {
				copyright: '@grutenberg. All rights reserved.',
				design: 'Design:'
			},
            options: {}
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

        switcher.textContent = languageFlags[language];
        switcher.setAttribute('aria-label', 'Cambiar idioma. Idioma actual: ' + languageNames[language]);
        switcher.title = languageNames[language];
	}

	function translatePage(language) {
		var elements = document.querySelectorAll('[data-i18n]');

		elements.forEach(function (element) {
			var key = element.getAttribute('data-i18n');
			var translation = getTranslation(language, key) || getTranslation(defaultLanguage, key);
            console.log('Translating key:', key, 'to language:', language, 'translation found:', translation);

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

    window.JKi18n = {
        translations: translations,
    }
})();
