## angularAMD.route 路由配置

通过使用 `angularAMD.route` 我们可以动态配置所需要加载的 `controllers`;

```javascript
app.config(function ($routeProvider) {
    $routeProvider.when(
        "/home",
        angularAMD.route({
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            controllerUrl: './js/controller/home'
        })
    );
});
```

#### 指定默认访问地址

通过配置`otherwise`,我们可以讲没有定义的路由地址默认请求到404或者首页上来。
``` javascript
app.config(function ($routeProvider) {
    $routeProvider

        .when("/home", angularAMD.route({
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl',
            controllerUrl: './js/controller/home.js'
        }))

        ...

    .otherwise({
        redirectTo: "/home"
    });
});
```

#### 不设置 controllerUrl

当然如果你已经在 `main.js` 中定义了controller 的地址这样你可以不用设置controlerUrl
```javascript
// main.js
paths: { 'HomeController': 'scripts/controller' }
```

#### 不设置 controller

如果你忽略了在配置中设置`controller`选项，那么`angularAMD.route`则会讲函数从`controlerUrl`返回回来，那么这样
你可以避免抛出一个未定义的controller 名称的错误。
``` javascript
define(['app'], function (app) {
    return ["$scope", function ($scope) {
        ...
    }];
});
```

### 扩展路由

当然我们可以自定义设置路由的返回，我们可以自定义扩展一个函数，动态解析url,自动匹配controller 和 controllerUrl.

``` javascript
/** 路由分析 传入路由地址自动拆分寻找 view 和 controller
 ** @routeUrl  路由定义
 ** @data 是否需要数据
 ** 输入 '/test/home' => { view: '/test_home/view',controller:TestHomeCtrl,controllerUrl: /test/home.js }
 **/

var routeConfig = function (routeUrl, data) {
    var paramStr = '';
    if (typeof (data) == 'object' && data != {}) {
        paramStr = '?'.serialize(data);
    };
    var t = routeUrl.replace(/\//g, '-');

    var routeArr = t.split('-');
    routeArr = routeArr.splice(1);
    
    var viewUrl =  '/' + routeArr.join('_') + '/view';
    // JS_ROOT 为 js 根目录
    var jsUrl = JS_ROOT + '/' + routeArr[0] + '/' + routeArr.splice(1).join('-') + '.js';
    var c = dashToCamel(t + '-' + 'ctrl');
    return {
        templateUrl: viewUrl + '?' + paramStr,
        controller: c,
        controllerUrl: jsUrl
    }

}

```

### 监测路由

我们可以在`app.js` 去检测路由的请求状态

``` javascript
app.run(function($rootScope) {

    var ngProgress = ngProgressFactory.createInstance();

    $rootScope.$on('$routeChangeStart', function() {
        // 路由请求开始    
    });

    $rootScope.$on('$routeChangeSuccess', function() {
       // 路由请求完成
    });
    
    $rootScope.$on('$routeChangeError', function() {
       // 路由请求出错
    });

});

```
更多参数设置: https://docs.angularjs.org/api/ngRoute/service/$route


[下一章:控制器](#controller) 

