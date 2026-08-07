/* Replace this value when the services API is available. */
const API_URL = 'https://script.google.com/macros/s/AKfycbwcHVffKRTz6d7G9YsPgAjDm6uC5NB_HAhtmg3FSWpoIkRN6sSgXRQwrOL1fxIoRfdx3g/exec';

(function ($) {
	'use strict';

	const serviceSections = ['manicure', 'massage', 'lashing'];

	function getServiceContainer(section) {
		return $('#' + section).find('.row.aln-center').first();
	}

	function showMessage(section, message) {
		const $container = getServiceContainer(section);

		$container.empty().append(
			$('<div>', { class: 'col-12' }).append(
				$('<p>').text(message)
			)
		);
	}

	function renderServices(section, services) {
		const $container = getServiceContainer(section);
		const servicesByType = {};

		$.each(services, function (_, service) {
			if (!service || typeof service.type !== 'string' || typeof service.name !== 'string' || service.price === undefined || service.price === null) {
				return;
			}

			if (!servicesByType[service.type]) {
				servicesByType[service.type] = [];
			}

			servicesByType[service.type].push(service);
		});

		$container.empty();

		if ($.isEmptyObject(servicesByType)) {
			showMessage(section, 'No hay servicios disponibles por el momento.');
			return;
		}

		$.each(servicesByType, function (type, servicesForType) {
			const $box = $('<section>', { class: 'box style1', style: 'height: 100%'}).append(
				$('<h3>').text(type)
			);

			$.each(servicesForType, function (_, service) {
				$box.append(
					$('<div>', { class: 'row' }).append(
						$('<div>', { class: 'col-8', 'data-i18n': "options."+service.index })
							.css('text-align', 'start')
							.text(service.name),
						$('<div>', { class: 'col-4' }).text("$"+service.price)
					)
				);
			});

			$container.append(
				$('<div>', { class: 'col-4 col-6-medium col-12-small' }).append($box)
			);
		});
	}

	function storeServicesTranslations(services) {
		const t = window.JKi18n && window.JKi18n.translations;
		if (!Array.isArray(services)) {
			return;
		}

		$.each(services, function (_, service) {
			if (!service || typeof service.index !== 'string' || typeof service.name !== 'string') {
				return;
			}

			t.es.options[service.index] = service.name;
			t.en.options[service.index] = service.name_en;
			t.pt.options[service.index] = service.name_pt;

		});

	}

	function loadServices() {
		if (!API_URL) {
			$.each(serviceSections, function (_, section) {
				showMessage(section, 'Los servicios se actualizaran proximamente.');
			});
			console.error('Set API_URL in assets/js/api.js before loading services.');
			return;
		}

		$.each(serviceSections, function (_, section) {
			showMessage(section, 'Cargando servicios...');
		});

		$.ajax({
			url: API_URL,
			dataType: 'json'
		}).done(function (data) {
			$.each(serviceSections, function (_, section) {
				renderServices(section, $.isArray(data && data[section]) ? data[section] : []);
				storeServicesTranslations($.isArray(data && data[section]) ? data[section] : []);
			});
		}).fail(function (jqXHR, textStatus, errorThrown) {
			$.each(serviceSections, function (_, section) {
				showMessage(section, 'No fue posible cargar los servicios. Intentalo nuevamente mas tarde.');
			});
			console.error('Could not load services:', textStatus, errorThrown, jqXHR.responseText);
		});
	}

	$(loadServices);
})(jQuery);
