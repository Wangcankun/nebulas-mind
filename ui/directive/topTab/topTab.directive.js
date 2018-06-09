angular.module('kityminderEditor')
    .directive('topTab',['nebulasService', function(nebulasService) {
       return {
           restrict: 'A',
           templateUrl: 'ui/directive/topTab/topTab.html',
           scope: {
               minder: '=topTab',
               editor: '=',
               mainSign: '='
           },
           link: function(scope) {

               /*
               *
               * 用户选择一个新的选项卡会执行 setCurTab 和 foldTopTab 两个函数
               * 用户点击原来的选项卡会执行 foldTopTop 一个函数
               *
               * 也就是每次选择新的选项卡都会执行 setCurTab，初始化的时候也会执行 setCurTab 函数
               * 因此用 executedCurTab 记录是否已经执行了 setCurTab 函数
               * 用 isInit 记录是否是初始化的状态，在任意一个函数时候 isInit 设置为 false
               * 用 isOpen 记录是否打开了 topTab
               *
               * 因此用到了三个 mutex
               * */
               var executedCurTab = false;
               var isInit = true;
               var isOpen = true;
               

               scope.setCurTab = function(tabName) {
                   setTimeout(function() {
                       //console.log('set cur tab to : ' + tabName);
                       executedCurTab = true;
                       //isOpen = false;
                       if (tabName != 'idea') {
                           isInit = false;
                       }
                   });
                };

               scope.toggleTopTab = function() {
                   setTimeout(function() {
                       if(!executedCurTab || isInit) {
                           isInit = false;

                           isOpen ? closeTopTab(): openTopTab();
                           isOpen = !isOpen;
                       }

                       executedCurTab = false;
                   });
               };

               function closeTopTab() {
                   var $tabContent = $('.tab-content');
                   var $minderEditor = $('.minder-editor');

                   $tabContent.animate({
                       height: 0,
                       display: 'none'
                   });

                   $minderEditor.animate({
                      top: '32px'
                   });
               }

               function openTopTab() {
                   var $tabContent = $('.tab-content');
                   var $minderEditor = $('.minder-editor');

                   $tabContent.animate({
                       height: '60px',
                       display: 'block'
                   });

                   $minderEditor.animate({
                       top: '92px'
                   });
               }

               scope.newFile = function(){
                  console.log("new");
                  console.log(window.minder);
                  var json = window.minder.exportJson();
				  json.root.children = [];
                  json.root.data.text = "星云思维";
						
				  window.minder.importJson(json);
               }

               scope.saveFile = function()
               {
                  console.log("save");
                  var storage=window.localStorage;
                  var json = window.minder.exportJson();
                  storage.setItem("mindjson",JSON.stringify(json));
                  nebulasService.save(json);
               }

               scope.loadFile = function(){
                  console.log("load");
                  var storage=window.localStorage;
                  var jsonstring = storage.getItem("mindjson");
                  console.log(jsonstring);
                  window.minder.importJson(JSON.parse(jsonstring));
               }


               scope.$on("mainSign",function(e,new_mainSign){
                    console.log(new_mainSign);
                    if(angular.isUndefined(new_mainSign)){
                       
                    }
                    else if(new_mainSign.type == "create"){
                        
                        var json = window.minder.exportJson();

                        json.root.children = [];
                        json.root.data.text = new_mainSign.value;
                        json.theme = "fresh-blue";
                        json.template = "default";
                        setTimeout(function () {      
                           window.minder.importJson(json);
                        },500);
                        
                    }else if(new_mainSign.type == "load"){
                       
                        setTimeout(function () {
                           window.minder.importJson(JSON.parse(new_mainSign.value.minddata));
                        },500);
                    }
               })

               
           }
       }
    }]);