/**a testbank name components**/
define(['angularAMD'], function (angularAMD) {
    
    angularAMD.directive('testbankNameText', function ($parse, $http) {
        
        return {
            restrict: 'EA',
            replace: true,
            scope: {
            
            },
            template:  '<span class="m-testbank-name-text">'
                            + '<input type="text" autofocus ng-focus="hideMessage()" name="testbank_name" value="{{ testbankName }}" maxLength="50" class="form-element text js-testbank-name" ng-blur="checkName($event)" required/>'    
                            + '<span class="result-notice fui-check"></span>'
                            + '<span class="result-msg"></span>'
                        +'</span>',
            link: function ( $scope,$element) {
                
                $scope.sendMessage = function(str,isWrong) {
                    if(isWrong == true){
                        $element.find('.result-notice').addClass('error fui-cross');    
                    }else{
                        $element.find('.result-notice').addClass('fui-check'); 
                    }
                    
                    $element.find('.result-msg').text(str).show();
                    
                };
                
                $scope.hideMessage = function() {
                    $element.find('.result-notice').removeClass('error fui-check fui-cross').fadeTo(0);
                    $element.find('.result-msg').text('').hide();   
                }
                
                $scope.checkName = function(e) {
                    var $el = $(e.target);
                    var testbankName = $el.val().trim();
                    if(testbankName == ''){
                        return $scope.sendMessage('题目名称不能为空!',1);
                    }
                    App.send('existTestbank',{
                        data:{
                            'testbank_name': testbankName
                        },
                        success: function(result) {
                            if(result.errcode != 0){
                                $scope.sendMessage(result.errstr,true);
                            }else{
                                $scope.sendMessage('',false);
                            }
                        }
                    })
                }


            }
        };
    });
    
    
});