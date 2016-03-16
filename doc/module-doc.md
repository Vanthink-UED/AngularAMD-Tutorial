## 创建 Module

目前 angularAMD 支持的模块内部定义的方法有:

+ `.provider`

+ `.controller`

+ `.factory`

+ `.service`

+ `.constant`

+ `.value`

+ `.directive`

+ `.filter`

+ `.animation`

你可以快速写一个 `fatory`
``` javascript
define(['app'], function (app) {
    app.factory('Pictures', function (...) {
        ...
    });
});
```

### 加载单独定义的模块服务
如果我们希望自己写一些单独定义的功能的服务，比如`service`,`directive`等。`angularAMD`提供了这样的功能;
directive/navMenu.js
``` javascript
define(['angularAMD'], function (angularAMD) {
    angularAMD.directive('navMenu', function (...) {
        ...
    });
});
```
app.js

```javascript
define(['angularAMD', 'directive/navMenu'], function (angularAMD) {
    var app = angular.module(app_name, ['webapp']);
    ...
    // `navMenu` is automatically registered bootstrap 
    return angularAMD.bootstrap(app);
});
```

### 引入第三方 Modules

第三方插件我们经常会用到，在AngularAMD中使用这些插件可以直接在main.js定义后直接在app.js中引用即可.

`ng-progress` 中已经在main.js中定义过;
``` javascript
define(['angularAMD', 'angular-route','vued.cat','ng-progress'], function (angularAMD) {

    var app = angular.module("webapp", ['ngRoute','Vued.cat','ngProgress']);
    
    // ...
    return angularAMD.bootstrap(app);
});
```

如果你希望在某个controller 中引入第三方插件，比如一个分页插件

``` javascript
define(['app', 'ngload!pagination'], function (app) {
    app.controller('ModuleCtrl', function ($scope,$http) { 
     
    });
});
```
### demo

``` javascript

// module.js
define(['app','ngload!pagination'], function (app) {  
    app.controller('ModuleCtrl', function ($scope,$routeParams,$http,$location) {  
        
        $scope.list = [];
        $scope.totalCount = 100;
        $scope.init = function() {
            var blocks = document.querySelectorAll('pre code');
            for(var i=0;i<blocks.length;i++) {
                
                hljs.highlightBlock(blocks[i]);    
            }
            $scope.refresh();
        };
        
        $scope.refresh = function() {
            var list = [];
            for(var i = 0;i<10; i++){
                list.push({
                    'name': 'Naruto',
                    'sex': 'man',
                    'age': parseInt(Math.random() * 100)
                });
            }
            $scope.list = list;
        };
        
        $scope.pageChangeEvent = function(num) {
            $scope.pageno = num;
            $scope.refresh();
        };
        
        $scope.viewOldEvent = function() {
            alert(this.item.name + ' is ' + this.item.age + ' years old!');
        }
        
        
        $scope.init();
    });
}); 

```
html

```html
<div class="demo" style="padding:20px;border:1px solid #ddd;">
    
    <table class="m-table bordered">
        <thead>
            <tr>
                <th>name</th>
                <th>age</th>
                <th>control</th>
            </tr>
        </thead>
        <tbody>
            <tr dir-paginate="item in list | itemsPerPage:10" total-items="totalCount" current-page="pageno">
                <td>{{item.name}}</td>
                <td>{{item.age}}</td>
                <td><a href="" ng-click="viewOldEvent()">View Detail</a></td>
            </tr>
            <tr ng-show="list==false">
                <td colspan="3">暂无数据</td>
            </tr>
        </tbody>
    </table>
    <dir-pagination-controls boundary-links="true" ng-hide="list2.length==0" on-page-change="pageChangeEvent(newPageNumber)"></dir-pagination-controls>
    
</div>
```


[下一章:种子使用](#seed) 




