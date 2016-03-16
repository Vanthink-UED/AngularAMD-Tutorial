// 入口文件
define(['angularAMD', 'angular-route','vued.cat','ng-progress'], function (angularAMD) {

    var app = angular.module("webapp", ['ngRoute','Vued.cat','ngProgress']);
    app.config(function ($routeProvider) {
        $routeProvider
        
            .when("/home", angularAMD.route({
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                controllerUrl: './js/controller/home.js'
            }))
        
            .when("/get-started", angularAMD.route({
                templateUrl: 'views/get-started.html',
                controller: 'HomeCtrl',
                controllerUrl: './js/controller/home.js'
            }))
            .when("/directory", angularAMD.route({
                templateUrl: 'views/directory.html',
                controller: 'HomeCtrl',
                controllerUrl: './js/controller/home.js'
            }))
            .when("/route", angularAMD.route({
                templateUrl: 'views/route.html',
                controller: 'HomeCtrl',
                controllerUrl: './js/controller/home.js'
            }))
            .when("/controller", angularAMD.route({
                templateUrl: 'views/controller.html',
                controller: 'ControllerCtrl',
                controllerUrl: './js/controller/controller.js'
            }))
            .when("/module", angularAMD.route({
                templateUrl: 'views/module.html',
                controller: 'ModuleCtrl',
                controllerUrl: './js/controller/module.js'
            }))
            .when("/seed", angularAMD.route({
                templateUrl: 'views/seed.html',
                controller: 'HomeCtrl',
                controllerUrl: './js/controller/home.js'
            }))
            .when("/more-doc", angularAMD.route({
                templateUrl: 'views/more-doc.html',
                controller: 'HomeCtrl',
                controllerUrl: './js/controller/home.js'
            }))
            .when("/others", angularAMD.route({
                templateUrl: 'views/others.html',
                controller: 'HomeCtrl',
                controllerUrl: './js/controller/home.js'
            }))
            

        .otherwise({
            redirectTo: "/home"
        });
    });
    
    
    /** route watch **/
    app.run(function($rootScope, ngProgressFactory,catset) {

        var ngProgress = ngProgressFactory.createInstance();

        $rootScope.$on('$routeChangeStart', function() {
            ngProgress.start();
            catset();
        });

        $rootScope.$on('$routeChangeSuccess', function() {
            // code highlight
            ngProgress.complete();
            
            var blocks = document.querySelectorAll('pre code');
            for(var i=0;i<blocks.length;i++) {
                
                hljs.highlightBlock(blocks[i]);    
            }
            
        });
        
    });



    return angularAMD.bootstrap(app);
});