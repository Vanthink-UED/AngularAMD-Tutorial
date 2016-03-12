define(['angularAMD'], function (angularAMD) {


    angularAMD.directive('selectYourTestbank', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope:{
                setClass: '@',
                tbno: '=',
                showStatus: '='
            },
            templateUrl: 'public/js/templates/select-your-testbank.tpl.html?v=' + App.version,
            link: function ($scope, $element, $attrs) {
            
                $scope.init = function() {
                    $scope.selectedList = [];
                    $scope.pageno = 1;
                    $scope.totalPage = 0;
                    $scope.pagesize = 10;
                    $scope.keyword = '';
                    $scope.list = [];
                    // 题目详情列表
                    $scope.list2 = [];
                    
                    $scope.loaded = false;
                    $scope.$watch('showStatus',
                        function (newValue) { 
                            if(newValue){
                                $scope.totalCount = 0;
                                $scope.refresh();
                                
                                $element.show();
                            }else{
                                $scope.list = [];
                                $scope.list2 = [];
                                $element.hide();
                            }
                        }
                    ,true);
                }
               
                
                $scope.showSearchEvent = function(e) {
                    $(e.currentTarget).toggleClass('open');
                }
                $element.find('.m-students-search-box').on('click',function(e) {
                    e.stopPropagation();
                });
                $scope.searchTestbankEvent = function(e) {
                    $scope.keyword = $element.find('.js-query-words').val();
                    $scope.isMine = $element.find('.js-query-type').attr('checked')?1:0;
                    $scope.refresh();
                };
                
                $scope.nextEvent = function() {
                    if($scope.pageno == $scope.totalPage ){
                        return App.sendMessage('已经没有记录了哦');
                    }
                    $scope.pageno ++;
                    $scope.refresh();
                }
                
                $scope.prevEvent = function() {
                    if($scope.pageno == 1 ){
                        return App.sendMessage('已经是第一页');
                    }
                    $scope.pageno --;
                    $scope.refresh();
                }
                
                $scope.pageChange = function(num){
                    $scope.pageno = num;
                    $scope.refresh();
                }
                
                
                $scope.refresh = function() {
                    $scope.list = [];
                    $scope.loaded = false;
                    App.send('searchFavoriteList',{
                        data:{
                            keyword: $scope.keyword,
                            type: $scope.isMine,
                            pageno: $scope.pageno
                        },
                        success:function(result) {
                            $scope.loaded = true;
                            if(result.errcode == 0){
                                $scope.totalCount = result.data.count;
                                $scope.list = result.data.list;
                                $scope.list2 = [];
                                $element.find('.js-select-all').attr('checked',false);
                                $scope.$apply();
                               
                            }else{
                                $scope.list = [];
                                $scope.$apply(); 
                            
                            }
                        }
                    });
                }
                
                $scope.getDetailsEvent = function(e) {
                    e.preventDefault();
                    $element.find('.testbank-list a').removeClass('selected');
                    $(e.target).addClass('selected');
                    App.LoadingSpinner.show('','数据初始化中...');
                    App.send('getTestbankDetail',{
//                    	type: 'post',
                        data:{
                           testbank_no: this.item.testbank_no  
//                        	testbank_no: 242
                        },
                        success: function(result) {

                            App.LoadingSpinner.hide();
                            if(result.errcode == 0){
                                
                                $scope.$apply(function(){
                                    $scope.selectedList = [];
                                    if(result.data.list.length==0 || result.data.list == ''){
                                        $scope.list2 = [];
                                    }
                                    $scope.list2 = result.data.list;
                                    
                                });
                            }else{
                                $scope.list2 = [];
                                App.sendMessage(result.errstr);    
                            }
                        }
                    });    

            
                }
                
                
                $scope.removeOneEvent = function(e,idx) {

                    App.Array.removeItem(this.page,$scope.selectedTestbankList);
                    $(e.currentTarget).hide();
                    $(e.currentTarget).prev().css('display','inline-block');
                    $element.find('.main-item-list li').eq(idx).removeClass('selected');
                }
                
                $scope.finishEvent = function() {
                    if($scope.selectedList.length == 0){
                        App.sendMessage('您还未勾选题目');
                        return;
                    }
                    
                    $scope.$root.$broadcast("testbankTask", $scope.selectedList);
                    $scope.hide();
                }
                
                $scope.selectAllEvent = function(e) {
                    if($scope.selectedList.length != $scope.list2.length){
                        $scope.selectedList = [];
                        for(var i=0;i<$scope.list2.length;i++){
                            App.Array.addItem({
                                no: $scope.list2[i]['ubint64_no'],
                                word:$scope.list2[i]['vchar64_word'],
                                desc:$scope.list2[i]['vchar64_prompt']
                            },$scope.selectedList);     
                        }
                        $element.find('.js-select-item').attr('checked',true);
                    }else{
                        $scope.selectedList = []; 
                        $element.find('.js-select-item').attr('checked',false);
                    }
                };
                
                $scope.selectItemEvent = function(idx,e) {
                    var el = $(e.currentTarget).find('.js-select-item')[0];
                    if(!el.checked) {
                        App.Array.addItem({
                            no: $scope.list2[idx]['ubint64_no'],
                            word:$scope.list2[idx]['vchar64_word'],
                            desc:$scope.list2[idx]['vchar64_prompt']
                        },$scope.selectedList); 
                        el.checked = true;
                    }else {
                        App.Array.removeItem({
                            no: $scope.list2[idx]['ubint64_no'],
                            word:$scope.list2[idx]['vchar64_word'],
                            desc:$scope.list2[idx]['vchar64_prompt']
                        },$scope.selectedList); 
                        el.checked = false;
                    }       
                };
                
                
                
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