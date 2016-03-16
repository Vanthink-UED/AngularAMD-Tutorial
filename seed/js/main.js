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
            'pagination': './directive/pagination'
        },
        shim: {
                'angularAMD': ['angular'],
                'angular-route': ['angular'],
                'ng-progress': ['angular'],
        },
        deps: ['app']
});
