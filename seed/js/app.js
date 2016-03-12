// 入口文件
define(['angularAMD', 'angular-route', 'angular.pagination' , 'autocomplete','wordsuggest','responsivevoice'], function (angularAMD) {
    
  var app = angular.module("webapp", ['ngRoute', 'Vued.directives.pagination','Vued.autocomplete','Vued.wordsuggest']);
  app.config(function ($routeProvider) {
    $routeProvider
    .when("/home", angularAMD.route({
        templateUrl: 'index/home', controller: 'HomeCtrl', controllerUrl:  ANGULAR_CTRL_PATH + 'home.js'
    }))
   .when("/create", angularAMD.route({
        templateUrl: 'index/create', controller: 'CreateCtrl', controllerUrl: ANGULAR_CTRL_PATH  + 'create.js'
    }))
    .when("/select", angularAMD.route({
        templateUrl: 'index/select', controller: 'SelectCtrl', controllerUrl: ANGULAR_CTRL_PATH + 'select.js'
    }))
    .when("/detail", angularAMD.route({
        templateUrl: function(params){ return 'index/detail?id=' + params.id; },
        controller: 'DetailCtrl',
        controllerUrl: ANGULAR_CTRL_PATH + 'detail.js'
    }))

    .when("/game", angularAMD.route({
        templateUrl: function(params){ return 'index/game?id=' + params.id; },
        controller: 'GameCtrl',
        controllerUrl: ANGULAR_CTRL_PATH + 'game.js'
    }))
    
    .otherwise({redirectTo: "/home"});
  });
    
  // angular directive
    
    app.directive('delegateClicks', function(){
      return function($scope, element, attrs) {
        var fn = attrs.delegateClicks;
        element.on('click', attrs.delegateSelector, function(e){
          var data = angular.fromJson( angular.element( e.target ).data('ngJson') || undefined );
          if( typeof $scope[ fn ] == "function" ) $scope[ fn ]( e, data );
        });
      };
    });
       
  //App.Audio.playBackgroundMusic();
  $('.btn-control-music').on('click',function() {
      $(this).toggleClass('disabled');
      if($(this).hasClass('disabled')){
        $(this).find('.tips').text('播放音乐');
        App.Audio.pause();
      }else{
        $(this).find('.tips').text('关闭音乐');
        App.Audio.play();
      }
  });
  
  return angularAMD.bootstrap(app);
});
