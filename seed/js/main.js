var LIB_PATH = 'http://s1.vued.vanthink.cn';
var JS_PATH = '/HM3.0/public/js/';
var ANGULAR_CTRL_PATH = '/HM3.0/public/js/controller/';
var ANGULAR_DIR_PATH = '/HM3.0/public/js/directive/';
var ANGULAR_SER_PATH = '/HM3.0/public/js/service/';
require.config({
        baseUrl: "public/js",
        urlArgs: App.debug != true? 'bust=' + App.version : 'bust=' + (new Date()).getTime() + Math.random() * 10000,
        paths: {
            'jquery': 'http://s1.vued.vanthink.cn/jquery-1.7.2.min',
            'angular': 'http://s1.vued.vanthink.cn/angular.min',
            'angular-route': 'http://s1.vued.vanthink.cn/angular-route',
            'angularAMD': 'http://s1.vued.vanthink.cn/angularAMD.min',
            'ngload' : LIB_PATH + 'ngload.min',
            'validator': LIB_PATH + 'validator.min',
            'responsivevoice': 'http://s1.vued.vanthink.cn/responsivevoice.no_debug.min',
            'base': JS_PATH + 'base',
            'app': JS_PATH +  'app',
            'keyshortcut': ANGULAR_SER_PATH + 'keyshortcut',
            'pagination': ANGULAR_DIR_PATH + 'pagination',
            'autocomplete': ANGULAR_DIR_PATH+ 'autocomplete',
            'wordsuggest': ANGULAR_DIR_PATH + 'wordsuggest',
            'select-your-testbank': ANGULAR_DIR_PATH + 'select-your-testbank',
            'testbank-name-text': ANGULAR_DIR_PATH + 'testbank-name-text',
            'angular.pagination': 'http://s1.vued.vanthink.cn/01021b1b2076/pagination.min',
            'wordbook': ANGULAR_DIR_PATH + 'wordbook',
        },
        shim: {
                'angularAMD': ['angular'],
                'angular-route': ['angular'] ,
                'base':{
                        "exports": 'Base'
                },
                'validator':{
                        "exports": 'validator'
                },
                'bootstrap':{
                        "exports": 'bootstrap'
                },

                'responsivevoice':{
                        "exports": 'responsivevoice'
                },
        },
        deps: ['app']
});
