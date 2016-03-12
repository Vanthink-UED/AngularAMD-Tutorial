// create.js

define(['app','select-your-testbank','testbank-name-text','wordbook'], function (app) {

    app.controller('CreateCtrl',['$rootScope', '$scope','$route','$routeParams', function ($rootScope,$scope, $route,$routeParams) {

       
                
        $scope.testbankName = 'Hangman' + (new Date()).format('Ymdhis');
              
        
        $scope.maxTestbankNum = App.config.max_testbank_num;
        $scope.isPreview = false;
        $scope.list = [];
        
        $scope.loadFavoriteList = false;
        $scope.pagesize= 10;
        $scope.currentPage = 1;
        $scope.totalCount = 0;
        $scope.keyword = '';
        $scope.step = 1;
        $scope.range = 0;
        $scope.pass = '';
        $scope.mode = App.config.mode;
        $scope.userid = App.UserCenter.getUserid();
        $scope.selectedList = [];
        $scope.isAutoSpeak = 1;
        // 单词本是否隐藏
        $scope.showWordbook = false;
        // 题库是否隐藏
        $scope.showTbpool = false;
        $scope.init = function () {
            $('.g-button-list').show();
            App.Form.validate('.m-form');
            for(var i=5;i-->0;){
                $scope.list.push({
                    'no': 0,
                    'word':'',
                    'desc': ''
                });
            }
            

            
            var oldContents = App.LocalStorage.getKeyVal('hangmanContents');
            
            if(oldContents.length>0){
                
                if($scope.findRealLength(oldContents)>0){
                    $('.js-cache-notifaction').show();  
                }
                
                
            }
            setTimeout(function(){
                $('.js-cache-notifaction').hide(); 
                $scope.autoSave();
            },2500);
            
            
            //订阅勾选的题目
            $rootScope.$on("testbankTask", function (e, data) {

                $scope.pushTestbank(data);
            });
            
            
            
            

        };
        
        $scope.toggleAutoSpeakEvent = function(e) {
            $scope.isAutoSpeak = $scope.isAutoSpeak?0:1;
            if($scope.isAutoSpeak) {
                $(e.currentTarget).find('.circle').text('ON');
            }else{
                $(e.currentTarget).find('.circle').text('OFF');
            }
        }
        
        $scope.useCacheEvent = function() {
            var oldContents = App.LocalStorage.getKeyVal('hangmanContents');   
            $scope.list = oldContents;
            $('.js-cache-notifaction').hide(); 
 
        };
        
        $scope.refuseCacheEvent = function() {
            App.LocalStorage.setKey('hangmanContents',[]);
            $('.js-cache-notifaction').hide();     
        };
        
        
        
        $scope.autoSuggestEvent = function(e,$idx) {
            
            setTimeout(function() {
                var val = $(e.target).val().trim();
                val = val.replace(/\s\s*/g,' ');
                $(e.target).val(val);
                if(val == ''){
                    return;
                }
                var default_api = 'http://api.vanthink.cn/api/word/tsOne?en=' + val + '&callback=?';
                if(/\s+/.test(val)){
                    var default_api = 'http://api.vanthink.cn/api/word/tsSentence?sentence=' + val + '&callback=?';
                }

                 $.ajax({
                    url: default_api,
                    dataType: "jsonp",
                    success: function (result) {
                        if(result.errcode == 0){
                            $scope.$apply(function() {
                                var transDesc = result.data.slice(0,26);
                                $scope.list[$idx]['desc'] = transDesc;
                            })
                        }else{

                        }    
                    },
                    cache: true
                });   
            },200);
            
        
        };
        
        $scope.creteTestbankItem = function() {
            var num = $scope.list.length + 1;
            $scope.testbankId = num;
             
            $scope.resetForm();
          
        };
        
        $scope.removeVocabularItem = function (index) {
            if($scope.list.length==1){
                return App.sendMessage('至少需要一道题目');
            }
            var item = $scope.list[index];
            App.Array.removeItem(item, $scope.list);
        };

        $scope.addVocabularItem = function (index) {
            if($scope.list.length == $scope.maxTestbankNum){
                return App.sendMessage('题目数量最多为' + $scope.maxTestbankNum + '道');
            }
            
            $scope.list.push({
                'no': 0,
                'word':'',
                'desc': ''
            });
            
            
            var height = Math.max( document.body.scrollHeight, document.body.offsetHeight);
            var winHeight = $(window).height();
            if( height > winHeight){
                var sH = $('body').scrollTop();
                $('body').scrollTop(sH + 33);
            }    
            
        };
        
        $scope.saveTestbankItem = function(formData) {
            $scope.list.push(formData);  
            App.LocalStorage.setKey('testbankList',$scope.list);
            
            $scope.creteTestbankItem();
        };
        
        $scope.resetForm = function() {
            $('.m-form .text').val('');
            
        };
        
        $scope.setPolicyEvent = function() {
            var cts = App.Template.getContents('pwd-setting',{range:$scope.range,pass : $scope.pass});
            $('body').delegate('.finish-setting-pwd input[type="radio"]','click',function(e) {
                if($('.finish-setting-pwd').find('input[type="radio"]:checked').val() == 0 ){
                     $('.finish-setting-pwd').find('.form-group-pwd').hide();
                }else {
                     $('.finish-setting-pwd').find('.form-group-pwd').show();
                }
            });
            App.BoxManage.confirm('设置权限',cts,function(win){
                var pass = $('.finish-setting-pwd').find('.js-pwd-text').val();
                var range = $('.finish-setting-pwd').find('input[type="radio"]:checked').val()
                if(range == 1){
                    if(!/^[0-9]{6}$/.test(pass)){
                        App.sendMessage('密码只能为6位数字');
                        win.disable = true;
                        return;
                    }
                }
                $scope.$apply(function(){
                    $scope.range = range;
                    $scope.pass = pass;
                })    
            });
        };
        
        
        
        $scope.prevEvent = function() {
            $scope.step = 1;
        };
        
        
        

        
        $scope.saveTestbankEvent = function() {
            
            var tbname = $('.js-testbank-name').val().trim();
            if(tbname == ''){
                return App.sendMessage('题目名称不能为空!');
            }
            var testbankArr = [];
            for(var i=0;i<$scope.list.length;i++){
                if($scope.list[i]['word'] == ''){
                    return App.sendMessage('第' + (i+1) + '道问题单词不能为空');
                }
                if(!/^[a-zA-Z\'\-\s()\/\\]+$/.test($scope.list[i]['word'])){
                    return App.sendMessage('第' + (i+1) + '道问题单词拼写有误');
                }
                
                if($scope.list[i]['desc'].length==0){
                    return App.BoxManage.confirm('提示','第' + (i+1) + '道问题描述为空,是否继续保存?',function() {
                        $scope.list[i]['desc'] = ' ';       
                    });
                }
                testbankArr.push({"exercise_name":$scope.list[i]['word'],"exercise_prompt":$scope.list[i]['desc']});
            }
           
            
            App.LoadingSpinner.show('','保存中...');
            var testbankStr = JSON.stringify({
                'testbank_name': tbname,
                'range': $scope.range,
                'password': $scope.pass,
                'voice': $scope.isAutoSpeak
            });
            App.send('addTestbank',{
                type: 'post',
                data:{
                    'testbank': testbankStr,
                    'exercises': JSON.stringify(testbankArr)
                },
                success: function(result) {
                    App.LoadingSpinner.hide();
                    if(!result.errcode){
                       
                        $scope.$apply(function() {
                            $scope.step=3;
                            $scope.testbankNo = result.data.testbank_no;
                            $scope.list = [];
                            $scope.testbankName = tbname;
                        });
                        App.sendMessage('保存成功！');
                        App.LocalStorage.setKey('hangmanContents',[]);
                    }else{
                        return App.sendMessage(result.errstr);
                    }
                }
            });
            
            
        };
        
        $scope.useOldEvent = function() {
            $scope.showTbpool = true;
        };
        
        $scope.cancelSelectTestbankEvent = function() {
             $('.create-form').show();
             $('.favorite-testbank-list').hide();
        
        };
        
         $scope.openWordbookEvent = function() {
             
             $scope.showWordbook = true;
        
        };
        
        $scope.findRealLength = function(data) {
            
            var data = data || $scope.list;
            var m = n =data.length;
            for(var i=0;i<m;i++){
                if(data[i]['word'] == '' && data[i]['desc'] == ''){
                    n--;   
                }
            }
            
            return n;
        };
        
        $scope.removeEmptyContents = function() {
            
            for(var i=0;i<$scope.list.length;i++){
                if($scope.list[i]['word'] == '' && $scope.list[i]['desc'] == ''){
                    $scope.list.splice(i,1);
                    i--;
                }
            }   
            
        };
        
        
        
        
        
       
        
        
        
        
        
        $scope.pushTestbank = function(data) {
            var totalNum = $scope.selectedList.length + $scope.findRealLength();
            if(totalNum>$scope.maxTestbankNum){
                return App.sendMessage('总题目数量超过' + $scope.maxTestbankNum + '道' );
            }
            $scope.removeEmptyContents();
            
            
            for(var i=0;i<data.length;i++){
                App.Array.addItem({
                    'no':data[i]['no'],
                    'word': data[i]['word'] ,
                    'desc': data[i]['desc']
                },$scope.list,'no');
            }
            

        };
        

       
        

        
        
        $scope.editAll = function() {
            $('.create-form').hide();
            $('.preview-form').hide();
            $('.finish-form').show();
        };
        
        
        
        $scope.removeAll = function() {
            var id = $scope.testbankNo;            
            App.BoxManage.confirm('提示','确定需要删除吗?',function(){
                App.send('remove_item',{
                    data:{
                        id: id,
                    },
                    success: function(result){
                        if(result.errcode == 0){
                            App.sendMessage('删除成功！');
                            App.reload();
                        }else{
                            App.sendMessage(result.errstr);
                        }
                    }
                })    
           });
        };
        
        
        $scope.autoSave = function() {
            window.setInterval( function() {
                App.LocalStorage.setKey('hangmanContents',JSON.stringify($scope.list));
            } ,2500);
        };
        
        $scope.createNewEvent = function() {
            App.reload();
        };
        
        $scope.returnPlatformEvent = function() {
            var data = [{
                tbno: $scope.testbankNo,
                tbname: $scope.testbankName
            }];
            App.postMessage(data,'*');
        }
        
        
    }]);
});
