angular.module('kityminderEditor')
	.directive('mainPage', ['config', 'minder.service', 'revokeDialog','nebulasService', function(config, minderService, revokeDialog,nebulasService) {
		return {
			restrict: 'EA',
			templateUrl: 'ui/directive/mainPage/mainPage.html',
			replace: true,
			scope: {
				isshow: '='
			},
			link: function(scope, element, attributes) {
				var storage=window.localStorage;
			    var showstatus = storage.getItem("isshow");
				if(angular.isUndefined(showstatus))
				{
	
						scope.isshow = true;
				}else{
						scope.isshow = showstatus;
				}
				scope.isTitle=1;
				scope.rootDatas=[];
				scope.mainSign = {type:""};
				
				
				function detectWallet () {
					var config = nebulasService.getConfig();
					config.wallet.plugInExist = typeof(webExtensionWallet) !== 'undefined'? true: false;
					if (!config.wallet.plugInExist) {
					  console.error('wallet no exist');
					}
					else{
						console.error('wallet is exist');
						nebulasService.setConfig(config);
						console.error(config);
					}
				}
				


				detectWallet();
				
				scope.next = function(){
					if(scope.filename == "" || !scope.filename)
					{
						alert("文件名不能为空");
					}
					else{
						scope.mainSign = {type:"create",value:scope.filename};
						scope.$broadcast ('mainSign', scope.mainSign);
						scope.isshow = false;
						var storage=window.localStorage;
					    storage.setItem("isshow",scope.isshow);
					}
					  
				}
				scope.loadData = function(data){
					
					scope.mainSign = {type:"load",value:data};
					scope.$broadcast ('mainSign', scope.mainSign);
					scope.isshow = false;
					var storage=window.localStorage;
					storage.setItem("isshow",scope.isshow);
				}
				scope.changeTitle = function(code){
					scope.isTitle = code;
				}
				scope.search = function(){
					if(scope.filename == "" || !scope.filename)
					{
						alert("文件名不能为空");
					}
					else{
						
						var check_wallet = nebulasService.checkwallet();
						if(!check_wallet){
							return;
						}
					  nebulasService.get(scope.filename,function(data){
						
						scope.$apply(function(){
							scope.rootDatas.length = 0;
							if(data != null){
							    scope.rootDatas.push(data);
							}
						});
					  });
					  
					}
				}

			}
		}
	}]);