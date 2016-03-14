// 定义入口文件

require.config({
        baseUrl: "./js/",
        urlArgs:  'v=' + (new Date()).getTime() + Math.random() * 10000,
        paths: {
            'angular': './lib/angular.min',
            'angular-route': './lib/angular-route',
            'angularAMD': './lib/angularAMD.min',
            'ngload' : './lib/' + 'ngload.min',
        },
        shim: {
                'angularAMD': ['angular'],
                'angular-route': ['angular'] 
        },
        deps: ['app']
});
