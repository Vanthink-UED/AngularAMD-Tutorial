// edit.js
define(['app', 'core.image.upload', 'core.upload'], function (app) {

    app.controller('EditCtrl', function ($scope, $routeParams, $http, $location) {
        
        $scope.testbankNo = '';
        if($routeParams.id !== '' && /^[0-9]+$/.test($routeParams)){
            $scope.testbankNo = $routeParams.id;
        }else{
            $location.path('/home');
        }
        
        $scope.testbankName = 'PicQuiz' + (new Date()).format('Ymdhis');
        //$scope.testbankName = '火影忍者练习';
        
        $scope.audio = {
            name: '',
            src: ''
        };
        $scope.testbankId = 1;
        
        $scope.list = [];
        
        $scope.isPreview = false;
        $scope.vocabularyName = '';
        $scope.vocabularyRA = '';
        $scope.currentItem = 0;
        $scope.previewStatus = false;
        
        
        
        
        $scope.init = function () {

            App.Form.validate();
            
            $scope.imgsrc1 = '';
            $scope.imgsrc2 = '';
            $scope.imgsrc3 = '';
            
            $scope.bind();
            
            if($scope.testbankNo){
                $('.g-create-name').hide();
                $('.create-form ').show();
                App.LocalStorage.setKey('testbankList',$scope.list);
            }
            
            if($scope.isPreview){
                 $scope.preview();
            }
            
            $scope.creteTestbankItem();
            


        };
        
        
        $scope.creteTestbankItem = function() {
            var num = $scope.list.length + 1;
            $scope.testbankId = num;
             
            $scope.resetForm();
          
        };
        
        $scope.saveTestbankItem = function(formData) {
            $scope.list.push(formData);  
            App.LocalStorage.setKey('testbankList',$scope.list);
            
            $scope.creteTestbankItem();
        };
        
        $scope.resetForm = function() {
            if($scope.testbankId == 1){
                return;
            };
            
            console.log($scope.testbankId);
            $scope.vocabularyName = '';
            $('.js-vocabulary-name').val('');
            $scope.audio = {
                src:'',
                name: ''
            };
            
            $('.js-vocabulary-ra').attr('checked',false);
            $scope.imgsrc1 = '';
            $scope.imgsrc2 = '';
            $scope.imgsrc3 = '';
            
            $scope.bind();
            
            
        };
        
        $scope.resetEvent = function() {
            $scope.vocabularyName = '';
            $('.js-vocabulary-name').val('');
            $scope.audio = {
                src:'',
                name: ''
            };
            
            $('.js-vocabulary-ra').attr('checked',false);
            $scope.imgsrc1 = '';
            $scope.imgsrc2 = '';
            $scope.imgsrc3 = '';
            
        };
        

        
        $scope.saveTestbank = function() {
            $scope.testbankName = $('.js-testbank-name').val().trim();
            if($scope.testbankName == ''){
                return App.sendMessage('题目名称不能为空！');
            }
            App.send('check_testbank',{
                data:{
                    'testbank_name':$scope.testbankName
                },
                success: function(result) {
                    if(!result.errcode){
                        App.LoadingSpinner.show('','保存中...');
                        App.send('save_testbank',{
                            data:{
                                'testbank_name':$scope.testbankName
                            },
                            success: function(result) {
                                if(!result.errcode){
                                    App.sendMessage('保存成功！');
                                    App.LoadingSpinner.hide();
                                    $scope.$apply(function() {
                                        $scope.testbankNo = result.data;
                                        $('.g-create-name').hide();
                                        $('.create-form ').show();
                                        App.LocalStorage.setKey('testbankList',$scope.list);
                                    });
                                }else{
                                    App.sendMessage(result.errstr);
                                }
                            }
                        });  
                    }else{
                        return App.sendMessage(result.errstr);
                    }
                }
            });
            
            
        };
        
        $scope.viewAllList = function(e){
            if($(e.target).text() == 0){
                return;
            }
            App.BoxManage.view('题目列表','list',{data: $scope.list},function(){
            
            });
        };
        

        
        $scope.bind = function() {
            
            $(".js-upload1").PictureCut({
                InputOfImageDirectory: "image",
                enableCrop: true,
                cropRatio: '2:3',
                CropWindowStyle: "Bootstrap",
                actionToSubmitUpload: "./image_upload",
                actionToSubmitCrop: './image_crop',
                uploadedCallback: function (result) {
                    $('.js-image1').val(result.src);
                    $scope.$apply(function(){
                        $scope.imgsrc1 = result.src;
                    });

                }
            });
            
            $(".js-upload2").PictureCut({
                InputOfImageDirectory: "image",
                enableCrop: true,
                cropRatio: '2:3',
                CropWindowStyle: "Bootstrap",
                actionToSubmitUpload: "./image_upload",
                actionToSubmitCrop: './image_crop',
                uploadedCallback: function (result) {
                    $('.js-image2').val(result.src);
                    $scope.$apply(function(){
                        $scope.imgsrc2 = result.src;
                    });

                }
            });
            
            $(".js-upload3").PictureCut({
                InputOfImageDirectory: "image",
                enableCrop: true,
                cropRatio: '2:3',
                CropWindowStyle: "Bootstrap",
                actionToSubmitUpload: "./image_upload",
                actionToSubmitCrop: './image_crop',
                uploadedCallback: function (result) {
                    $('.js-image3').val(result.src);
                    $scope.$apply(function(){
                        $scope.imgsrc3 = result.src;
                    });

                }
            });
            

            $(".js-upload-audio").CoreUpload({
                extensions: ['mp3', 'ogg'],
                actionToSubmitUpload: "./audio_upload",
                enableDrag: true,
                uploadedCallback: function (result) {
                    $scope.$apply(function(){
                        $scope.audio = {
                            name:result.data.name,
                            src: result.data.src
                        };
                    });
                }
            });
            
            
        };
        
        $scope.removeImage1 = function(e) {
            $scope.imgsrc1 = '';   
        };
        
        $scope.removeImage2 = function(e) {
            $scope.imgsrc2 = '';   
        };
        
        $scope.removeImage3 = function(e) {
            $scope.imgsrc3 = '';   
        };
        
        $scope.editImage1 = function() {
            $scope.imgsrc1 = '';
        };
        
        $scope.editImage2 = function() {
            $scope.imgsrc2 = '';
        };
        
        $scope.editImage3 = function() {
            $scope.imgsrc3 = '';
        };
        
        $scope.clearAudio = function() {
            $scope.audio = {
                name: '',
                src: ''
            };
        
        };
        
        $scope.playAudio = function(e,src) {
            $(e.target).hide();
            $(e.target).next().show();
            App.Audio.play($('.js-audio-src').val());
        
        };
        
        $scope.pauseAudio = function(e) {
            $(e.target).hide();
            $(e.target).prev().show();
            App.Audio.pause();
        
        };
        
        $scope.preview = function(id){
            $('.img-list2 .item.correct').removeClass('correct'); 
            $('.img-list2 .item').find('div[class*="icon"').remove(); 
            $scope.vocabularyName = $scope.list[$scope.currentItem]['vocabularyName'];
            $scope.vocabularyRA = $scope.list[$scope.currentItem]['vocabularyRA'];
            $scope.imgsrc1 = $scope.list[$scope.currentItem]['vocabularyA'];
            $scope.imgsrc2 = $scope.list[$scope.currentItem]['vocabularyB'];
            $scope.imgsrc3 = $scope.list[$scope.currentItem]['vocabularyC'];
            
            var r = $scope.list[$scope.currentItem]['record'];
                  
            if(r==''){
                $scope.audio = {
                    src:r,
                    name: ''
                };
            }else{
                $scope.audio = {
                    src:r,
                    name: '音乐附件'
                };
            }  
            
            $('.create-form').hide();
            $('.preview-form').show();
            $('.preview-form .img-list2 .item').eq('ABC'.indexOf($scope.vocabularyRA)).addClass('correct').append('<div class="correct-icon fui-check"></div>');
            
        };
        
       
        

        $scope.recordAudio = function (e) {
            App.BoxManage.show({
                name: 'RecordWindow'
            });

        };

        $scope.save = function () {
            var vocabularyName = $('.js-vocabulary-name').val();
            
            if(!vocabularyName){
                App.sendMessage('题目名称不能为空');
                $('.js-vocabulary-name').focus();
                return;
            }
            
            if($scope.imgsrc1 == '' || $scope.imgsrc2 == '' || $scope.imgsrc3 == ''){
                return App.sendMessage('请上传图片!');
            }
            
            if($('.js-vocabulary-ra:checked').length == 0){
                return App.sendMessage('请勾选正确答案!');
            }
            
            App.LoadingSpinner.show();
            App.send('save_create',{
                type:'post',
                data:$('form').serialize(),
                success: function(result) {
                    App.LoadingSpinner.hide();
                    if(!result.errcode){
                        App.sendMessage('保存成功！');
                        var data = App.unserialize($('form').serialize());
                        data['id'] = result.data;
                        $scope.saveTestbankItem(data);
                        $scope.$apply(function() {
                            $scope.currentItem ++;
                        });
                    }else{
                        App.sendMessage(result.errmsg);
                    }
                }
            });
        };
        
        
        $scope.saveAll = function () {
            
            if($scope.list.length==0){
                return App.BoxManage.alert('提示','您还未创建任何练习？');
            }
            App.LoadingSpinner.show('','数据保存中...');
            App.send('save_all_exercise',{
                data:{
                    testbank_no: $scope.testbankNo
                },
                success: function(result) {
                    App.LoadingSpinner.hide();
                    if(!result.errcode){
                        App.sendMessage('保存成功！');
                        $scope.$apply(function() {
                            $scope.previewStatus = true;
                            $scope.currentItem = 0;
                            $scope.preview();
                            
                        });
                        
                    }else{
                        App.sendMessage(result.errmsg);
                    }
                }
            });
        };
        
        
        $scope.cancel = function() {
            var id = $scope.testbankNo;            
            App.BoxManage.confirm('提示','确定放弃当前题目创作吗?',function(){
                App.send('remove_item',{
                    data:{
                        id: id,
                    },
                    success: function(result){
                        if(result.errcode == 0){
                            App.reload();
                        }else{
                            App.sendMessage(result.errstr);
                        }
                    }
                })    
           });
        
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
        
        $scope.next = function() {
            if($scope.length == 10){
                App.BoxManage.alert('警告','最大只能创建10道题目？');
                return;   
            }
            $scope.currentItem++;
            $scope.preview();
        };
        
        $scope.prev = function() {
            $scope.currentItem--;
            $scope.preview();
        };
        
        $scope.createNew = function() {
            window.location.reload();
        };
        
        $scope.edit = function() {
            $scope.eid = $scope.list[$scope.currentItem]['id'];
            $scope.vocabularyName = $scope.list[$scope.currentItem]['vocabularyName'];
            $scope.vocabularyRA = $scope.list[$scope.currentItem]['vocabularyRA'];
            $scope.imgsrc1 = $scope.list[$scope.currentItem]['vocabularyA'];
            $scope.imgsrc2 = $scope.list[$scope.currentItem]['vocabularyB'];
            $scope.imgsrc3 = $scope.list[$scope.currentItem]['vocabularyC'];
            
            var r = $scope.list[$scope.currentItem]['record'];
            if(r==''){
                $scope.audio = {
                    src:r,
                    name: ''
                };
            }else{
                $scope.audio = {
                    src:r,
                    name: '音频附件'
                };
            }     
 
            $('.js-vocabulary-name').val($scope.vocabularyName);      
            $('.js-vocabulary-ra[value=' + $scope.vocabularyRA +']').attr('checked','checked');
            
            $('.create-form').show();
            $('.preview-form').hide();
               
        };
        
        $scope.saveEdit = function() {
            var vocabularyName = $('.js-vocabulary-name').val();
            
            if(!vocabularyName){
                App.sendMessage('题目名称不能为空');
                $('.js-vocabulary-name').focus();
                return;
            }
            
            if($scope.imgsrc1 == '' || $scope.imgsrc2 == '' || $scope.imgsrc3 == ''){
                return App.sendMessage('请上传图片!');
            }
            
            if($('.js-vocabulary-ra:checked').length == 0){
                return App.sendMessage('请勾选正确答案!');
            }
            
            //App.LoadingSpinner.show();
            App.send('save_edit',{
                type:'post',
                data:$('form').serialize(),
                success: function(result) {
                    App.LoadingSpinner.hide();
                    if(!result.errcode){
                        App.sendMessage('保存成功！');
                        var data = App.unserialize($('form').serialize());
                        data['id'] = result.data;
                        $scope.list[$scope.currentItem] = data;
                         App.LocalStorage.setKey('testbankList',$scope.list);
                        $scope.preview();
                    }else{
                        App.sendMessage(result.errmsg);
                    }
                }
            });
            
               
        };
        
        $scope.cancelEdit = function() {

            $scope.preview();
               
        };
        
        $scope.removeItem = function() {
            var id = $scope.list[$scope.currentItem]['id'];            
            App.BoxManage.confirm('提示','确定需要删除改题目吗?',function(){
                App.send('remove_exercise_item',{
                    data:{
                        id: id,
                    },
                    success: function(result){
                        if(result.errcode == 0){
                            App.sendMessage('删除成功！');
                            if($scope.currentItem==0){
                                App.reload();
                            }else{
                                $scope.splice($scope.currentItem,1);
                                $scope.currentItem--;
                                $scope.preview(); 
                            }
                        }else{
                            App.sendMessage(result.errstr);
                        }
                    }
                })    
           });   
        };
        
        $scope.removeEvent = function(e){        
            App.BoxManage.confirm('提示','确定需要删除吗',function(){
                App.send('remove_item',{
                    data:{
                        id: $scope.id,
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
        
        
        
        
        
        





    });

    



});