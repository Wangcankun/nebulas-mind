angular.module('kityminderEditor')
	.directive('kityminderEditor', ['config', 'minder.service', 'revokeDialog', function(config, minderService, revokeDialog) {
		return {
			restrict: 'EA',
			templateUrl: 'ui/directive/kityminderEditor/kityminderEditor.html',
			replace: true,
			scope: {
				onInit: '&',
				isshow: '=',
				mainSign: '='
			},
			link: function(scope, element, attributes) {
				console.log(scope.isshow);
				console.log(scope.mainSign);
				var $minderEditor = element.children('.minder-editor')[0];
				function onInit(editor, minder) {
					scope.onInit({
						editor: editor,
						minder: minder
					});

					minderService.executeCallback();
				}

				scope.back = function(){
					alert("返回主页");
					scope.isshow = true;
					var storage=window.localStorage;
					storage.setItem("isshow",scope.isshow);
				}

				if (typeof(seajs) != 'undefined') {
					/* global seajs */
					seajs.config({
						base: './src'
					});

					define('demo', function(require) {
						var Editor = require('editor');

						var editor = window.editor = new Editor($minderEditor);

						if (window.localStorage.__dev_minder_content) {
							editor.minder.importJson(JSON.parse(window.localStorage.__dev_minder_content));
						}

						editor.minder.on('contentchange', function() {
							window.localStorage.__dev_minder_content = JSON.stringify(editor.minder.exportJson());
						});

						window.minder = window.km = editor.minder;

						scope.editor = editor;
						scope.minder = minder;
                        scope.config = config.get();

                        //scope.minder.setDefaultOptions(scope.config);
						scope.$apply();

						onInit(editor, minder);
					});

					seajs.use('demo');

				} else if (window.kityminder && window.kityminder.Editor) {
					var editor = new kityminder.Editor($minderEditor);

					window.editor = scope.editor = editor;
					window.minder = scope.minder = editor.minder;

                    scope.config = config.get();

                    //scope.minder.setDefaultOptions(config.getConfig());

                    onInit(editor, editor.minder);
                }

			}
		}
	}]);