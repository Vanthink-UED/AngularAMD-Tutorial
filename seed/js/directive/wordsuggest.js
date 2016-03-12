define(['angularAMD'], function (angularAMD) {

    angular.module('Vued.wordsuggest', [] )
        .directive('wordSuggest', function ($parse, $http,$compile) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                'searchStr': '=searchstr',
                'ngModel': '=',
                'blurEvent': '&ngBlur'
                
            },
            
           // template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" ng-keyup="keyPressed($event)"/><div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown"><div class="angucomplete-searching" ng-show="searching"><img src="http://img1.vued.vanthink.cn/vuedcca37dabcb5bc724cb7418658e526a1e.gif"/></div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)"></div><div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div ng-if="result.image && result.image != \'\'" class="angucomplete-image-holder"><img ng-src="{{result.image}}" class="angucomplete-image"/></div><div>{{result.title}}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div>',
            
            replace: 'append',
            
            terminal: true,

            
            controller: function ($scope,$element) {
                $scope.lastFoundWord = null;
                $scope.currentIndex = null;
                $scope.justChanged = false;
                $scope.searchTimer = null;
                $scope.searching = false;
                $scope.pause = 300;
                $scope.minLength = 3;
                $scope.words = false;
                
                if ($scope.minLengthUser && $scope.minLengthUser != "") {
                    $scope.minLength = $scope.minLengthUser;
                }

                if ($scope.userPause) {
                    $scope.pause = $scope.userPause;
                }

                $scope.processResults = function(responseData) {
                    if (responseData && responseData.length > 0) {
                        $scope.results = [];

                        var titleFields = [];
                        if ($scope.titleField && $scope.titleField != "") {
                            titleFields = $scope.titleField.split(",");
                        }

                        for (var i = 0; i < responseData.length; i++) {
                            // Get title variables
                            var titleCode = "";

                            for (var t = 0; t < titleFields.length; t++) {
                                if (t > 0) {
                                    titleCode = titleCode +  " + ' ' + ";
                                }
                                titleCode = titleCode + "responseData[i]." + titleFields[t];
                            }
                            if(titleFields.length ==0){
                                titleCode =  "responseData[i]";
                            }

                            // Figure out description
                            var description = "";

                            if ($scope.descriptionField && $scope.descriptionField != "") {
                                eval("description = responseData[i]." + $scope.descriptionField);
                            }

                            // Figure out image
                            var image = "";

                            if ($scope.imageField && $scope.imageField != "") {
                                eval("image = responseData[i]." + $scope.imageField);
                            }

                            var resultRow = {
                                title: eval(titleCode),
                                description: description,
                                image: image,
                                originalObject: responseData[i]
                            }
                            $scope.results[$scope.results.length] = resultRow;
                        }


                    } else {
                        $scope.results = [];
                    }
                }

                $scope.searchTimerComplete = function(str) {
                    // Begin the search

                    if (str.length >= $scope.minLength) {
                        /** 默认jsonp 不支持 **/

                        var url = '\/\/api.vanthink.cn/api/word/suggest?word=' + str + '&callback=JSON_CALLBACK';
                        $http.jsonp(url)
                        .success(
                            function(result, status, header, config){
                               $scope.searching = false;
                               if(result.errcode == 0){
                                    $scope.processResults(result.data);
                               }else{
                                    $scope.processResults([]);
                               }

                            }
                        )
                        .error(
                            function(data){
                               console.log("error"); 
                            }
                        );
                            
                    }

                }

               


                $scope.selectResult = function(result) {
                    $scope.searchStr = result.title;
                    $scope.selectedObject = result;
                    $scope.showDropdown = false;
                    $scope.results = [];
                    $element.val(result.title).change();
                    //$element.ngModel = result.title;
                   // $scope.ngModel.setViewValue($scope.searchStr);
                    $scope.$apply();
                    
                }
                
            },

            link: function($scope, elem, attrs, ctrl) {
                var template = '<div class="angucomplete-dropdown" ng-if="showDropdown && results.length > 0"><div class="angucomplete-searching" ng-show="searching"><img src="http://img1.vued.vanthink.cn/vuedcca37dabcb5bc724cb7418658e526a1e.gif"/></div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)"></div><div class="angucomplete-row" ng-repeat="result in results"  ng-class="{\'angucomplete-selected-row\': $index == currentIndex}" data-idx="{{ $index }}"><div>{{result.title}}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div>'
                var content = angular.element(template);
                elem.parent().append(content);
                $compile(content)($scope);
                
                 $('body').on('click',function() {
                    $scope.showDropdown = false;
                    $scope.$apply();
                });
                
                elem.parent().delegate('.angucomplete-row','click',function(e){
                   // e.stopPropagation();
                    e.preventDefault;
                    e.stopPropagation();
                    if ($scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                        $scope.selectResult($scope.results[$scope.currentIndex]);
                       
                        $scope.$apply();
                       
                    } else {
                        $scope.results = [];
                        $scope.$apply();
                    }  
                    
                });
                
                elem.parent().delegate('.angucomplete-row','mouseover',function(){
                    $scope.currentIndex = $(this).attr('data-idx');
                    $scope.$apply();
                });
                
                
                elem.parent().bind("keyup", function (event) {
                    if(event.which === 40) {
                        if (($scope.currentIndex + 1) < $scope.results.length) {
                            $scope.currentIndex ++;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                        $scope.$apply();
                    } else if(event.which == 38) {
                        if ($scope.currentIndex >= 1) {
                            $scope.currentIndex --;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                    } else if (event.which == 13) {
                        if ($scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                            $scope.selectResult($scope.results[$scope.currentIndex]);
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        } else {
                            $scope.results = [];
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                    } else if (event.which == 27) {
                        $scope.results = [];
                        $scope.showDropdown = false;
                        $scope.$apply();
                    } else if (event.which == 8) {
                        $scope.selectedObject = null;
                        $scope.$apply();
                    }
                });
                elem.bind('keyup' , function(event) {
                     var str = elem.val();
                    if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                        if (!str || str == "") {
                            $scope.showDropdown = false;
                        } else {
                            if (str.length >= $scope.minLength) {
                                $scope.showDropdown = true;
                                $scope.currentIndex = -1;
                                $scope.results = [];

                                if ($scope.searchTimer) {
                                    clearTimeout($scope.searchTimer);
                                }

                                $scope.searching = true;

                                $scope.searchTimer = setTimeout(function() {
                                    $scope.searchTimerComplete(elem.val());
                                }, $scope.pause);
                            }


                        }

                    } else {
                        event.preventDefault();
                    }
                });


            }
        };
    });
    
    
});