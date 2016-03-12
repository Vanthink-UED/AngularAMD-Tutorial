// detail.js
define(['app'], function (app) {  
    app.controller('DetailCtrl', function ($scope,$route,$routeParams,$http,$location) {
        
        $scope.init = function() {
            $scope.id = $routeParams.id; 
            $('.g-button-list').show();
            $scope.list = [];
            $scope.testbankName = '';
            $scope.eid = '';
            $scope.authorId = '';
            $scope.currentItem = 0;
            $scope.userid = App.UserCenter.getUserid();
            $scope.maxTestbankNum = App.config.max_testbank_num;
            $scope.isFavorite = false;
            $scope.pass = '';
            $scope.refresh();
            
        };
        
        $scope.toggleAutoSpeakEvent = function(e) {
            $scope.isAutoSpeak = $scope.isAutoSpeak==1?0:1;
        }
        
        $scope.removeEvent = function(e){        
            App.BoxManage.confirm('提示','确定需要删除吗',function(){
                App.send('removeTestbank',{
                    data:{
                        testbank_no: $scope.id,
                    },
                    success: function(result){
                        if(result.errcode == 0){
                            App.sendMessage('删除成功！');
                            location = '#select';
                        }else{
                            App.sendMessage(result.errstr);
                        }
                    }
                })    
           });
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
                'vchar64_prompt ':'',
                'vchar64_word': '',
                'ubint64_no':''
            });     
        };
        
        $scope.editEvent = function() {
            $scope.isEdit = true;
        };
        
        $scope.cancelEditEvent = function() {
            App.BoxManage.confirm('提示','确定放弃编辑当前题目?',function() {
                App.reload();
            });
        };
        
        

        $scope.setPassEvent = function() {
            $scope.pass = $('.js-pwd-text').val().trim();
            if($scope.pass == ''){
                return App.sendMessage('密码不能为空');
            }
            
            if(!/^[0-9]{6}$/.test($scope.pass)){
                return App.sendMessage('密码不能为空');
            }
            
            $scope.refresh();
        };
        
        $scope.resetPassEvent = function(pass) {
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
        
        $scope.refresh = function () {
            App.LoadingSpinner.show('', '数据初始化中...');
            App.send('getTestbankDetail', {
                data: {
                    testbank_no: $scope.id,
                    password: $scope.pass
                    
                },
                success: function (result) {
                    App.LoadingSpinner.hide();
                    if (result.errcode == 0) {
                        if($scope.pass != ''){
                            if(result.data.right == false){
                                App.sendMessage('密码错误');
                            }else{
                                App.sendMessage('验证成功');
                                $('.checkpass-form').hide();
                                $('.js-data-list').show();
                            }   
                        }
                        if(result.data.right == false){
                            $('.checkpass-form').show();
                            $('.js-data-list').hide();
                            return;
                        }
                        
                        if (!result.data.list || result.data.list == []) {
                            $('.lost-testbank').show();
                        }
                        $scope.$apply(function () {
                            $scope.list = result.data.list;
                            if($scope.userid == result.data.ubint64_author){
                                $scope.increasePreviewWord();
                            }else{
                                $scope.increasePreviewWord(true);
                            }
                            
                            $scope.totalCount = result.data.list.length;
                            $scope.authorId = result.data.ubint64_author;
                            $scope.createTime = result.data.dtime_createtime;
                            $scope.range = result.data.utint64_range;
                            $scope.pass = result.data.vchar16_passwd; 
                            $scope.isAutoSpeak = result.data.ubint64_voice;
                            $scope.testbankName = result.data.vchar64_testbank_name;
                            if(result.data.collection != false){
                                $scope.isFavorite = true;
                            }else{
                                $scope.isFavorite = false;
                            }
                            
                        });
                        
                    } else {
                        App.sendMessage(result.errstr);
                        $('.lost-testbank').show();
                    }
                }
            });   
        };
        
        // 进行单词 混淆
        $scope.increasePreviewWord = function(is_mixin) {
            var me = this 
            $.each($scope.list,function(idx,item) {
                if(is_mixin == true){
                    me.list[idx]['p_words'] = item['vchar64_word'].replace(/[a-zA-Z\'\-](?!$)/g,'*');
                }else{
                    me.list[idx]['p_words'] = item['vchar64_word'];
                }
                
                
            });
            
           
        };
        
        $scope.saveEditEvent = function() {
            var testbankName = $('.js-testbank-name').val().trim();
            if($scope.testbankName == ''){
                return App.sendMessage('题目名称不能为空！');
            }
            var testbankArr = [];
            for(var i=0;i<$scope.list.length;i++){
                if(!/^[a-zA-Z\'\s()\_\-]+$/.test($scope.list[i]['vchar64_word'])){
                    return App.sendMessage('第' + (i+1) + '道问题单词不合法');
                }
                
                if($.trim($scope.list[i]['vchar64_prompt']).length==0){
                    return App.sendMessage('第' + (i+1) + '道问题描述为空');
                }
                testbankArr.push({
                    'eno':$scope.list[i]['ubint64_no'],
                    'exercise_name':$scope.list[i]['vchar64_word'],
                    'exercise_prompt':$scope.list[i]['vchar64_prompt'],
                });
            }
            App.LoadingSpinner.show('','保存中...');
            var testbankStr = JSON.stringify({
                'testbank_name': testbankName,
                'range': $scope.range,
                'password': $scope.pass,
                'voice': $scope.isAutoSpeak,
                'testbank_no': $scope.id
            });
            App.send('modifyTestbank',{
                type: 'post',
                data:{
                    'testbank':testbankStr,
                    'exercises': JSON.stringify(testbankArr)
                },
                success: function(result) {
                    App.LoadingSpinner.hide();
                    if(!result.errcode){
                        App.sendMessage('保存成功!');
                        $scope.$apply(function() {
                            $route.reload();
                        });
                    }else{
                        return App.sendMessage(result.errstr);
                    }
                }
            });
        
        };
        
        
        $scope.removeFavoriteEvent = function() {
            
            App.send('removeFavorite',{
                data:{
                    testbank_no: $scope.id,
                    testbank_name: $scope.testbankName
                },
                
                success: function(result) {
                    if(result.errcode==0){
                        App.sendMessage('已经取消收藏!');
                        $scope.$apply(function() {
                            $scope.isFavorite = false;
                        });
                    }else{
                        App.sendMessage(result.errstr);
                    }
                } 
            
            });
            
           
            
        };
        
        $scope.playGameEvent = function() {
            location = '#/game?id=' + $scope.id;
        }
        
        $scope.backEvent = function() {
            if(window.history.length == 1){
                location = '#/select';
            }else{
                history.go(-1);
            }
        }
        
        
        $scope.addFavoriteEvent = function() {
            App.send('addFavorite',{
                data:{
                    testbank_no: $scope.id,
                    testbank_name: $scope.testbankName
                },
                
                success: function(result) {
                    if(result.errcode==0){
                        $heart = $('<p class="fui-heart"></p>');
                        $con = $('<div class="page page-favorite"><span>已经收藏</span></div>');
                        $con.append($heart);
                        $('.c-detail').append($con);
                        setTimeout(function() {
                            $con.remove();
                            $scope.$apply(function() {
                                $scope.isFavorite = true;
                            });
                        },2000);
                    }else{
                        App.sendMessage(result.errstr);
                    }
                } 
            
            });
        };
        
        $scope.autoSuggestEvent = function(e,$idx) {
            
            setTimeout(function() {
                var val = $(e.target).val().trim();
                val = val.replace(/\s\s*/g,' ');
                $(e.target).val(val);
                if(val == ''){
                    return;
                }
                var default_api = 'http:\/\/api.vanthink.cn/word/tsone.php?en=' + val + '&callback=?';
                if(/\s+/.test(val)){
                    var default_api = 'http:\/\/api.vanthink.cn/word/tsSentence.php?sentence=' + val + '&callback=?';
                }

                 $.ajax({
                    url: default_api,
                    dataType: "jsonp",
                    success: function (result) {
                        if(result.errcode == 0){
                            $scope.$apply(function() {
                                var transDesc = result.data.slice(0,26);
                                $scope.list[$idx]['vchar64_prompt'] = transDesc;
                            })
                        }else{

                        }    
                    },
                    cache: true
                });   
            },200);
            
        
        };
        
    });
}); 

