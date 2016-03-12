define(['angularAMD'], function (angularAMD) {

    /**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 */

    angular.module('Vued.autocomplete', [] )
        .directive('angucomplete', function ($parse, $http) {
        return {
            restrict: 'EA',
            scope: {
                "id": "@id",
                "placeholder": "@placeholder",
                "selectedObject": "=selectedobject",
                "url": "@url",
                "titleField": "@titlefield",
                "descriptionField": "@descriptionfield",
                "imageField": "@imagefield",
                "inputClass": "@inputclass",
                "userPause": "@pause",
                "localData": "=localdata",
                "searchFields": "@searchfields",
                "minLengthUser": "@minlength",
                'words': '=',
                'searchStr' : '=searchstr'
            },
            template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" ng-keyup="keyPressed($event)"/><div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown"><div class="angucomplete-searching" ng-show="searching">Searching...</div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div ng-if="result.image && result.image != \'\'" class="angucomplete-image-holder"><img ng-src="{{result.image}}" class="angucomplete-image"/></div><div>{{result.title}}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div>',
            controller: function ( $scope ) {
                $scope.lastFoundWord = null;
                $scope.currentIndex = null;
                $scope.justChanged = false;
                $scope.searchTimer = null;
                $scope.searching = false;
                $scope.pause = 500;
                $scope.minLength = 3;
                $scope.words = false;
                
                console.log($scope.searchStr);

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
                            console.log(titleCode);
                            $scope.results[$scope.results.length] = resultRow;
                        }


                    } else {
                        $scope.results = [];
                    }
                }

                $scope.searchTimerComplete = function(str) {
                    // Begin the search

                    if (str.length >= $scope.minLength) {
                        if ($scope.localData) {
                            var searchFields = $scope.searchFields.split(",");

                            var matches = [];

                            for (var i = 0; i < $scope.localData.length; i++) {
                                var match = false;

                                for (var s = 0; s < searchFields.length; s++) {
                                    var evalStr = 'match = match || ($scope.localData[i].' + searchFields[s] + '.toLowerCase().indexOf("' + str.toLowerCase() + '") >= 0)';
                                    eval(evalStr);
                                }

                                if (match) {
                                    matches[matches.length] = $scope.localData[i];
                                }
                            }

                            $scope.searching = false;
                            $scope.processResults(matches);
                            $scope.$apply();


                        } else if($scope.words) {
                            /** 默认jsonp 不支持 **/
                            var url = '\/\/api.vanthink.cn/word/suggest.php?word=' + $scope.searchStr + '&callback=JSON_CALLBACK';
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
//                             $.ajax({
//                                url: '//api.vanthink.cn/word/suggest.php?word=' + $scope.searchStr + '&callback=?',
//                                dataType: "jsonp",
//                                success: function (data) {
//                                    console.log(data)
//                                }
//                            });
                            
                           
                        } else {
                            
                            
                            $http.get($scope.url + str, {}).
                                success(function(responseData, status, headers, config) {
                                    $scope.searching = false;
                                    $scope.processResults(responseData);
                                }).
                                error(function(data, status, headers, config) {
                                    console.log("error");
                                });
                        }
                    }

                }

                $scope.hoverRow = function(index) {
                    $scope.currentIndex = index;
                }

                $scope.keyPressed = function(event) {
                    if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                        if (!$scope.searchStr || $scope.searchStr == "") {
                            $scope.showDropdown = false;
                        } else {

                            if ($scope.searchStr.length >= $scope.minLength) {
                                $scope.showDropdown = true;
                                $scope.currentIndex = -1;
                                $scope.results = [];

                                if ($scope.searchTimer) {
                                    clearTimeout($scope.searchTimer);
                                }

                                $scope.searching = true;

                                $scope.searchTimer = setTimeout(function() {
                                    $scope.searchTimerComplete($scope.searchStr);
                                }, $scope.pause);
                            }


                        }

                    } else {
                        event.preventDefault();
                    }
                }

                $scope.selectResult = function(result) {
                    $scope.searchStr = result.title;
                    $scope.selectedObject = result;
                    $scope.showDropdown = false;
                    $scope.results = [];
                    //$scope.$apply();
                }
            },

            
            link: function($scope, elem, attrs, ctrl) {
                
                elem.bind("keyup", function (event) {
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


            }
        };
    });
    
    
});