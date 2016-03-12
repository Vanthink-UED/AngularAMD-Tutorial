// game view
define(['app', 'base'], function (app) {

    var sortingOrder = 'id';
    app.controller('SelectCtrl', function ($routeParams, $scope,$rootScope, $http, $location) {
        $('.doc').removeClass('bg');
        $scope.totalCount = 0;
        $scope.pageSize = 10;

        $scope.pagedItems = [];
        $scope.currentPage = $routeParams['pageno'] || 1;
        $scope.author = '';
        $scope.keyword = $routeParams['keyword'] || '';
        $scope.items = [];
        $scope.userid = App.UserCenter.getUserid();
        $scope.mode = App.config.mode;
        $scope.list = [];
        $scope.selectedList = $rootScope.selectedList || [];
        $scope.selectedIds = '';
        $scope.queryType = $routeParams['type'] || 1;
        $scope.isPwd = $routeParams['isPwd'] || 0;
        $scope.init = function () {
            $('.g-button-list').show();
            if($scope.mode == 1){
               // $('.js-testbank-list td a').attr('target','_blank');
            }
            $scope.search();
            $scope.$watch('selectedList',function(newValue) {
                $rootScope.selectedList = newValue;   
            })
        };
        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

        $scope.searchEvent = function () {
            $scope.queryType = $('.js-query-type').val();
            $scope.isPwd = $('.js-query-pwd').attr('checked')?1:0;
            $scope.currentPage = 1;
            $location.search('keyword',$scope.keyword);
            $location.search('type',$scope.queryType);
            $location.search('isPwd',$scope.isPwd);
            $location.search('pageno',$scope.currentPage);
        };


        // init the filtered items
        $scope.search = function () {
            $('.js-query-type').val($scope.queryType);
            App.LoadingSpinner.show('.g-tbl', '加载中...');
            App.send('searchTestbankList', {
                data: {
                    pageno: $scope.currentPage,
                    keyword: $scope.keyword,
                    type: $scope.queryType,
                    no_password: $scope.isPwd
                },
                success: function (result) {
                    App.LoadingSpinner.hide();
                    if (result.errcode == 0) {
                        $scope.$apply(function () {
                            $scope.totalCount = result.data.count;
                            $scope.autoCheck(result.data.list);
                            

                        });
                    } else {
                        App.sendMessage(result.errmsg);
                    }
                }
            });
        };
        
         $scope.autoCheck = function(data) {
            
            if(data.length){
                $.each(data,function() {
                    for(var i=0,l=$scope.selectedList.length;i<l;i++){
                        if($scope.selectedList[i].tbno == this.ubint64_no){
                            this.checked = true;
                        }
                    }
                });
            }
            
            $scope.items = data;
        };






        $scope.pageChange = function (num) {
            $scope.currentPage = num;
            $location.search('pageno',$scope.currentPage);
        };
        
        $scope.checkPass = function(el) {
            
            App.send('checkPassword',{
                type: 'post',
                data:{
                    testbank_no: $(el).val(),
                    pasword: ''
                },
                success: function(result) {
                    if(result.errcode==0){
                        $(el).addClass('pass-checked');
                        App.Array.addItem({
                            tbno: $(el).val(),
                            tbname: $(el).attr('data-name')
                        }, $scope.selectedList);

                        el.checked = true;

                    }else{
                        $scope.showPassInput(el);
                    }   
                }
            });
            
            
        };
        // 传题目编号 和回调函数
        $scope.showPassInput = function(tbno,cb) {
            App.BoxManage.ask('输入密码','',function(text,win){
                if(text.length!=6){
                    win.disable = true;
                    App.sendMessage('密码必须为6位数字')
                    return;
                }

                return App.send('checkPassword',{
                    type: 'post',
                    data:{
                        testbank_no: tbno,
                        password: text
                    },
                    success: function(result) {
                        if(result.errcode==0){
                           App.sendMessage('验证成功!');
                           cb();

                        }else{
                            win.disable = true;
                            App.sendMessage(result.errstr);
                        }   
                    }
                });


            },{
                multiline:false                  
            });     
        };

        $scope.seleteItem = function (e) {
            
            var me = this;
            if(e.target.nodeName == 'A'){
                if(!this.item.is_pass && this.item.range == 1) {
                    e.preventDefault();
                    return me.showPassInput(me.item.testbank_no,function() {
                        $scope.$apply(function() {
                            var url = e.target.href.split('#')[1];
                            var id = url.split('=')[1];
                            $location.path(url.split('?')[0]).search({id: id});
                        });
                    });   
                }else{
                    return;    
                }
                    
            }
            var el = $(e.currentTarget).find("input[type='checkbox']")[0];
            if (el.checked) {
                el.checked = false;
                App.Array.removeItem({
                    tbno: this.item.testbank_no,
                    tbname: this.item.testbank_name,
                }, $scope.selectedList);
                
                $(e.currentTarget).removeClass('selected');
            } else {
                if(this.item.range == 1 && !$(el).hasClass('pass-checked') && this.item.ubint64_author != $scope.userid && $scope.mode == 1 ){
                    return $scope.showPassInput(me.item.testbank_no,function() {
                        $(el).addClass('pass-checked');
                         App.Array.addItem({
                            tbno: this.item.testbank_no,
                    tbname: this.item.testbank_name,
                        }, $scope.selectedList);
                        el.checked = true;
                        if($scope.mode == 1){
                            $(e.currentTarget).addClass('selected');
                        }
            
                        
                        $scope.$apply();
                        
                    });
                }
                
                App.Array.addItem({
                    tbno: this.item.testbank_no,
                    tbname: this.item.testbank_name,
                }, $scope.selectedList);
                if($scope.mode == 1){
                    $(e.currentTarget).addClass('selected');
                }
                

                el.checked = true;

            }


        };
        
        $scope.viewDetailEvent = function(e) {
            var id = $(e.currentTarget).find("input[type='checkbox']").val();
            location = "#/detail?id=" + id;
            return;
            if($scope.mode == 1){
                window.open('#/detail?id=' + id);
            }else{
                location = "#/detail?id=" + id;
            }
            
        }

       
        $scope.returnHomeEvent = function (e) {
            App.BoxManage.confirm('提示', '确定选择该作业?', function () {
                $rootScope.selectedList = [];  
                console.log($scope.selectedList);
                App.postMessage($scope.selectedList);
 
            });
        };


    });
});