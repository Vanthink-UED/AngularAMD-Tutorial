define(['angularAMD'], function (angularAMD) {


    angularAMD.directive('wordbook', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope:{
                setClass: '@',
                userid: '@',
                showStatus: '='
            },
            templateUrl: 'public/js/templates/wordbook.tpl.html?v=' + App.version,
            link: function ($scope, $element, $attrs) {
            
                $scope.init = function() {
                    $scope.selectedList = [];
                    $scope.pageno = 1;
                    $scope.total = 0;
                    $scope.totalPage = 0;
                    $scope.pagesize = 10;
                    $scope.keyword = '';
                    $scope.list = [];
                    $scope.loaded = false;
                    
                    $scope.$watch('showStatus',
                        function (newValue) { 
                            if(newValue){
                                $scope.selectedList = [];
                                $scope.refresh();
                                $scope.total = 0;
                                $element.addClass('active');
                                
                            }else{
                                $element.removeClass('active');
                                $scope.list = [];
                            }
                        }
                    ,true);
                }
               
                
                
                
                $scope.pageChangeEvent = function(num){
                    $scope.pageno = num;
                    $scope.refresh();
                }
                
                
                
                $scope.refresh = function() {
                    $scope.loaded = false;
                    $scope.list=[];
                    
                    $.ajax({
                        url: 'api/getMyVb',
                        data:{
                            keywords: $scope.keyword,
                            query: $scope.isMine,
                            pageno: $scope.pageno,
                            userid: $scope.userid,
                            pagesize:10
                            
                        },
                        dataType: 'json',
                        success:function(result) {
                            console.log(result);
                            $scope.loaded = true;
                            if(result.errcode == 0){
                                $scope.total = result.data.count;
                                $scope.autoCheck(result.data.list);
                                $scope.$apply();
                               
                            }else{
                                $scope.list = [];
                                $scope.total=0;
                                $scope.$apply(); 
                            
                            }
                            
                        }
                    });
                }
                
                $scope.autoCheck = function(data) {
                    $scope.allSelected = true;
                    if(data.length){
                        $.each(data,function() {
                            for(var i=0,l=$scope.selectedList.length;i<l;i++){
                                if($scope.selectedList[i].no == 'vb' +  this.ubint64_no){
                                    this.checked = true;
                                }
                                
                            }
                            if(!this.checked){
                                $scope.allSelected = false;
                                $scope.$apply();
                            }
                        });
                    }
                    $scope.list = data;
                };
                
                
                
                $scope.finishEvent = function() {
                    if($scope.selectedList.length == 0){
                        
                        return App.BoxManage.confirm('提示','您未勾选任何单词,确定返回吗?', function() {
                            $scope.hide();    
                        }); 
                    }
                    $scope.$root.$broadcast("testbankTask", $scope.selectedList);
                    $scope.hide();
                }
                
                $scope.selectAllEvent = function(e) {
                    if(!$scope.allSelected){
                        $scope.allSelected  = true;
                        for(var i=0;i<$scope.list.length;i++){
                            $scope.list[i]['checked'] = true;
                            App.Array.addItem({
                                no: 'vb' + $scope.list[i]['ubint64_no'],
                                word:$scope.list[i]['char64_vocabulary'],
                                desc:$scope.list[i]['vchar512_explaination']
                            },$scope.selectedList);     
                        }
                    }else{
                        $scope.allSelected = false;
                        for(var i=0;i<$scope.list.length;i++){
                             $scope.list[i]['checked'] = false;
                             App.Array.removeItem({
                                no: 'vb' + $scope.list[i]['ubint64_no'],
                                word:$scope.list[i]['char64_vocabulary'],
                                desc:$scope.list[i]['vchar512_explaination']
                            },$scope.selectedList); 
                        }
                       
                    }
                };
                
                $scope.selectItemEvent = function(idx,e) {
                    var el = $(e.currentTarget).find('.js-select-item')[0];
                    if(!this.item.checked) {
                        this.item.checked = true;
                        App.Array.addItem({
                            no: 'vb' + $scope.list[idx]['ubint64_no'],
                            word:$scope.list[idx]['char64_vocabulary'],
                            desc:$scope.list[idx]['vchar512_explaination']
                        },$scope.selectedList); 
                    }else {
                        this.item.checked = false;
                        App.Array.removeItem({
                            no: 'vb' + $scope.list[idx]['ubint64_no'],
                            word:$scope.list[idx]['char64_vocabulary'],
                            desc:$scope.list[idx]['vchar512_explaination']
                        },$scope.selectedList); 
                    }
                    $scope.doAllSetected();
                };
                
                $scope.doAllSetected = function() {
                    for(var i=0;i<$scope.list.length;i++){
                        if(!$scope.list[i]['checked']){
                            return $scope.allSelected = false;
                        }
                    }
                    $scope.allSelected = true;
                };
                
                $scope.speakWordEvent = function(words,e) {
                    e.stopPropagation();
                    if(/^[a-zA-Z\-\'\s]+$/.test(words)){
                        responsiveVoice.speak(words, "US English Female",{volume: 1});

                    }

                }
                
                $scope.hide = function(){
                    $scope.showStatus = false;
                }
                
                $scope.show = function() {
                    $scope.init();
                }
                                    
                $scope.init();
                     
                
            }
        };
    });
    


});