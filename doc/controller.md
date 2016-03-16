## controller 的使用

在AngularAMD定义controller非常简单,我们推荐两种写法:

``` javascript
// home.js
define(['app'], function (app) {  
    app.controller('ControllerCtrl', function ($scope,$routeParams,$http,$location) {  
        // 数据集
        $scope.list = false;
        
        // 初始化函数 需要在 view 里面和 ng-init 绑定
        $scope.init = function() {
               
        }
        
        // 刷新数据
        $scope.refresh = function() {
            
        }
        
        // 绑定点击事件 和 指定 view 中 ng-click 绑定
        $scope.clickEvent = function(e) {
        
        }
        
    });
}); 

``` 
或者我们也可以这样写
``` javascript
// controller.js
define(['app'], function (app) {  
    app.controller('ControllerCtrl', function ($scope,$routeParams,$http,$location) {  
        var modules = {
            
            init: function() {
                this.list = false;       
            },
            
            refresh: function() {
            
            },
            
            events:{
                click: function(e) {
                
                }
            },
            

        };
        
        return angular.extend($scope, modules);
        
    });
}); 
```


[下一章:模块](#module) 