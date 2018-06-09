angular.module('kityminderEditor', [
    'ui.bootstrap',
	'ui.codemirror',
	'ui.colorpicker'
])
	.config(function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self'
		]);
	});