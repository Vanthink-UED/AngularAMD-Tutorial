## 快速开始
[angularAMD](https://github.com/marcoslin/angularAMD)是作者@ [marcoslin](https://github.com/marcoslin)使用 RequireJS ＋ AngularJS开发的前端`mvvm`框架,因此你可以使用它快速创建一款Web App.它特别适合快速开发`SPA`应用。

### 安装

#### bower
```bash
bower install angularAMD

```
#### node
```bash
npm install angular-amd
```

#### 外链
``` bash
//cdn.jsdelivr.net/angular.amd/0.2/angularAMD.min.js
```
### 使用

#### 定义require.js 入口文件 

我们定义`main.js` 作为项目的入口文件,在这里可以定义我们的组件以及组件的依赖项;然后在`deps`里设置我们的项目主文件
`app.js`

```javascript
// 定义入口文件

require.config({
        baseUrl: "./js/",
        urlArgs:  'v=' + (new Date()).getTime() + Math.random() * 10000,
        paths: {
            'angular': './lib/angular.min',
            'angular-route': './lib/angular-route',
            'angularAMD': './lib/angularAMD.min',
            'ngload' : './lib/' + 'ngload.min',
            'ng-progress': './lib/ngprogress.min',
            'vued.cat': './directive/cat',
        },
        shim: {
                'angularAMD': ['angular'],
                'angular-route': ['angular'],
                'ng-progress': ['angular'],
        },
        deps: ['app']
});


```

#### 启动 AngularJS

当所有的组件依赖项全部被定义完成，那么app.js作为 Angular 项目的入口文件,将开始执行启动程序.

``` javascript
define(['angularAMD'], function (angularAMD) {
    var app = angular.module(app_name, ['webapp']);
    ... // Setup app here. E.g.: run .config with $routeProvider
    return angularAMD.bootstrap(app);
});
```

如果引导程序被触发，那么原有 `ng-app`就不应该被放置在 `HTML`中. `angularAMD.bootstrap(app)`将会取代程序启动。

### 配置路由

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
`angularAMD.route` 主要目的是去设置 require.js 中 `resolve` 去进行惰性加载 `controller` 以及 `view`,无论
你传入什么样的参数值进去，都会被返回。

这样访问 `index.html#/home` 就可以查看所做的修改了

[下一章:目录划分](#directory) 













