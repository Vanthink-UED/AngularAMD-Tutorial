// game.js
define(['app', 'base', 'keyshortcut'], function (app) {
    app.controller('GameCtrl', ['$scope', '$routeParams', '$route', '$location', 'keyshortcut', function ($scope, $routeParams, $route, $location, keyshortcut) {

        $scope.init = function () {
            $('.g-button-list').show();
            $scope.id = $routeParams.id;
            if ($scope.id.indexOf(',')) {
                $scope.ids = $scope.id.split(',');

                $scope.id = $scope.ids[0];
            } else {
                $scope.ids = [$scope.id];
            }
            $scope.currentId = 0;

            $scope.list = [];
            $scope.correctQList = [];
            $scope.errorQList = [];
            $scope.errorAList = []; // 错误答案集合
            $scope.item = null;
            $scope.testbankName = '';
            $scope.eid = '';
            $scope.currentItem = 0;
            $scope.stars = 0;
            $scope.integral = 0;
            $scope.startTime = (new Date()).format('Y-m-d H:i:s');
            $scope.activitiesTime = '00:00';
            $scope.IsRepractice = 0;
            $scope.timer;
            $scope.totalCount = 0;
            $scope.finishedAll = false;
            $scope.homework_no = $routeParams['hwid'] || '';
            $scope.maxErrorNum = 6; // 最多允许的错题次数
            $scope.isAutoSpeak = 1;
            $scope.orgList = [];
            $scope.rightAns = [];
            $scope.pass = '';
            $scope.errorStep = 0;
            $scope.mode = App.config.mode;
            $scope.score_no = '';
            $scope.refresh();
            $scope.bind();


        };

        $scope.transformTime = function () {
            return (parseInt($scope.activitiesTime.split(':')[0]) * 60 + parseInt($scope.activitiesTime.split(':')[1]));
        }

        $scope.setPassEvent = function () {
            $scope.pass = $('.js-pwd-text').val().trim();
            if ($scope.pass == '') {
                return App.sendMessage('密码不能为空');
            }

            if (!/^[0-9]{6}$/.test($scope.pass)) {
                return App.sendMessage('密码不能为空');
            }

            $scope.refresh();
        };



        $scope.refresh = function () {
            App.LoadingSpinner.show('', '数据初始化中...');
            if ($scope.id == 0) {
                $scope.isWordExercise = true;
            }
            App.send('getTestbankDetail', {
                data: {
                    testbank_no: $scope.id,
                    password: $scope.pass,
                    homework_no: $scope.homework_no
                },
                success: function (result) {
                    App.LoadingSpinner.hide();
                    if (result.errcode == 0) {

                        if ($scope.pass != '') {
                            if (result.data.right == false) {
                                App.sendMessage('密码错误');
                            } else {
                                App.sendMessage('验证成功');
                                $('.page-check-pass').hide();
                            }
                        }
                        if (result.data.right == false) {
                            $('.page-check-pass').show();
                            return;
                        }
                        if (!result.data.list || result.data.list.length == 0) {
                            $('.lost-testbank').show();
                            return;
                        }
                        App.Audio.play('ready');
                        $scope.$apply(function () {
                            var sArr = App.Array.shuffle(result.data.list)
                            $scope.list = sArr;
                            $scope.isAutoSpeak = result.data.ubint64_voice;
                            $scope.orgList = angular.copy(sArr);
                            $scope.totalCount = result.data.list.length;
                            $scope.testbankName = result.data.vchar64_testbank_name;
                            $scope.currentItem = 0;
                            $scope.getDetail();
                            $scope.recordTimeEvent();
                            if(result.data.__step){
                                App.postMessage({
                                    taskname:'practice-step',
                                    step: result.data.__step,
                                    step_name: result.data.__name,
                                    stars: result.data.__stars,
                                    integral: result.data.__integral
                                });
                            }
                        });
                       

                    } else {
                        App.sendMessage(result.errstr);
                        $('.lost-testbank').show();
                    }
                }
            });

        };

        // 切换到下个单词练习

        $scope.NextWordEvent = function () {
            App.postMessage({
                'taskname': 'reload'
            });
        };

        $scope.getDetail = function () {
            $scope.errorStep = 0;
            $scope.errorASingle = ''; // 当前输入答案字符
            $('.js-people-shake').hide();
            //clearkeyboard
            $('.keyborder-container .disabled').removeClass('disabled');
            $('.keyborder-container .active').removeClass('active');
            $('.answer-container .error-show').removeClass('error-show');
            $scope.item = {
                word: $scope.list[$scope.currentItem]['vchar64_word'].toLocaleLowerCase(),
                desc: $scope.list[$scope.currentItem]['vchar64_prompt']
            };
            $scope.eid = $scope.list[$scope.currentItem]['ubint64_no'];

            var word = $.trim($scope.item['word']);
            var wordArr = word.split('');
            var answerArr = [];
            $.each(wordArr, function (index, item) {
                answerArr.push({
                    visiable: (item == ' ' || item == '/') ? true : false,
                    character: item
                });
            });
            $scope.answer = answerArr;
            var userAgent = navigator.userAgent.toLocaleLowerCase();
            if (/chrome/.test(navigator.userAgent.toLowerCase()) && !/edge/.test(navigator.userAgent.toLowerCase())) {
                $scope.speakWordEvent();
            }

        };

        $scope.speakWordEvent = function (isSingle) {
            if (/^[a-zA-Z\-\'\s]+$/.test($scope.item['word']) && $scope.isAutoSpeak == 1) {
                responsiveVoice.speak($scope.item['word'], "US English Female", {
                    volume: 1
                });
                if (!isSingle) {
                    if ($scope.IsRepractice == false && $scope.currentId != 0) {
                        document.getElementById('g-audio').play();
                    }

                }

            }

        }

        $scope.bind = function () {
            App.Audio.pause();
            var me = this;

            $('.btn-continue').on('click', function () {
                if ($scope.list.length != $scope.currentItem + 1) {
                    App.Audio.play('goOn');
                }

            });
            $('.keyborder-container .key').on('click', function (e) {
                e.preventDefault();
                if ($(this).hasClass('disabled')) {
                    return;
                }
                var keyVal = $(this).text().toLocaleLowerCase();
                $scope.errorASingle += keyVal;
                if ($scope.item['word'].indexOf(keyVal) > -1) {
                    $(this).addClass('active');
                    App.Audio.play('click');
                    me.showAnswerFont(keyVal);
                } else {
                    $(this).addClass('disabled');
                    App.Audio.play('di');
                    $scope.$apply(function () {
                        $scope.errorStep++;
                        if ($scope.errorStep == 6) {
                            me.showErrorWin();
                        }
                    });

                }
            });

            keyshortcut.input(function (c) {
                if ($('.mask2').css('display') == 'block' || $('.mask').css('display') == 'block') {
                    return;
                }
                $('.keyborder-container .key:contains(' + c.toLocaleUpperCase() + ')').click();
            });

            keyshortcut.bind('enter', function (c) {
                if (($('.win-correct').css('display') == 'block' || $('.win-error').css('display') == 'block') && !$('.js-enter-key').hasClass('disable')) {

                    $('.js-enter-key').click();
                }
            });
            
            var rx = /INPUT|SELECT|TEXTAREA/i;

            $(document).bind("keydown keypress", function(e){
                if( e.which == 8 ){ // 8 == backspace
                    if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                        e.preventDefault();
                        
                    }
                }
            });


        };

        $scope.showAnswerFont = function (key) {

            for (var i = 0; i < $scope.answer.length; i++) {
                if ($scope.answer[i]['visiable'] == false && $scope.answer[i]['character'] == key) {
                    $scope.answer[i].visiable = true;
                }
            }

            $scope.$apply();

            for (var i = 0; i < $scope.answer.length; i++) {
                if ($scope.answer[i]['visiable'] == false) {
                    return;
                }
            }
            $('body').append('<div class="mask2"></div>');
            App.Audio.play('right');
            $('.win-correct').show();
            
            if ($scope.id == 0) {
                App.Array.removeItem($scope.list[$scope.currentItem],$scope.errorQList,'ubint64_no');
                App.send('updateWord', {
                    data: {
                        name: 'HM3.0',
                        word: $scope.list[$scope.currentItem]['vchar64_word'],
                        is_right: 1,
                        wrong_anwser: $scope.list[$scope.currentItem]['vchar64_word']

                    },
                    success: function(result) {
                        
                        
                        
                        App.postMessage({
                            taskname:'practice-score',
                            step: result.data.__step,
                            stars: result.data.stars,
                            integral: result.data.integral
                        });
                        
                        if($scope.correctQList.length == $scope.list.length){
                            App.postMessage({taskname: 'practice-next'}, '*');
                        }
                    }
                    
                })
            }

            $scope.correctQList.push($scope.list[$scope.currentItem]);


        }

        $scope.findCharcter = function (key) {
            for (var i = 0; i < $scope.answer.length; i++) {
                if ($scope.answer[i]['visiable'] == false && $scope.answer[i]['character'] == key) {
                    return i;
                }
            }
            return false;
        }

        $scope.showErrorWin = function () {
            App.Audio.play('wrong');
            if ($scope.id == 0) {
                App.send('updateWord', {
                    data: {
                        name: 'HM3.0',
                        word: $scope.list[$scope.currentItem]['vchar64_word'],
                        is_right: 0,
                        wrong_anwser: $scope.errorASingle

                    },
                    success: function(result) {
                        App.postMessage({
                            taskname:'practice-score',
                            step: result.data.__step,
                            stars: result.data.stars,
                            integral: result.data.integral
                        });
                    }
                })
            }
           
            if(App.Array.findItem($scope.list[$scope.currentItem],$scope.errorQList,'ubint64_no')===false){
                $scope.errorQList.push($scope.list[$scope.currentItem]);
            }
            
           
           
            
            
            for (var i = 0; i < $scope.answer.length; i++) {
                if ($scope.answer[i]['visiable'] == false) {
                    $('.answer-container .item-value').eq(i).addClass('error-show');

                    $scope.answer[i]['visiable'] = true;
                }
            }


            $scope.errorStep = 0;
            $('body').append('<div class="mask2"></div>');
            $('.win-error').show();
            $('.js-people-shake').show();
            $scope.errorAList.push($scope.errorASingle);
            $scope.rightAns.push($scope.list[$scope.currentItem]['vchar64_word']);
            $scope.errorASingle = '';
            
            if($scope.id==0){
                $scope.list.push($scope.list[$scope.currentItem]);
                $scope.list.splice($scope.currentItem,1);
                $scope.currentItem --;
            }
            


        }




        $scope.recordTimeEvent = function () {

            $scope.timeRunning = true;
            $('.win-break').hide();
            $('.mask').remove();
            $('.btn-next').attr('disabled', false);
            window.clearInterval($scope.timer);
            $scope.timer = window.setInterval(function () {
                var timeRecord = $scope.transformTime();
                timeRecord += 1;
                var m = parseInt(timeRecord / 60);
                var s = parseInt(timeRecord % 60);

                $scope.$apply(function () {
                    $scope.activitiesTime = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
                })

            }, 1000);
        };

        $scope.pauseTimeEvent = function (isFinished) {
            if (!isFinished) {
                App.Audio.play('reset');
            }

            $scope.timeRunning = false;
            window.clearInterval($scope.timer);
            $('.btn-next').attr('disabled', true);
            if (!isFinished) {
                $('.win-break').show();
                $('body').append('<div class="mask"></div>');
            }

        };



        $scope.nextEvent = function () {

            if ($scope.list.length == $scope.currentItem + 1) {
                $scope.saveGame();
                return;
            };
            $('.mask2').remove();
            $('.win-correct').hide();
            $('.win-error').hide();

            $scope.currentItem += 1;
            if ($scope.list.length == $scope.currentItem + 1) {
                App.sendMessage('已经是最后一道题目');
            };
            $scope.getDetail();


        };

        // 保存游戏
        $scope.saveGame = function () {
            $('.js-enter-key').addClass('disable');

            $scope.pauseTimeEvent(true);
            App.Audio.play('gameOver');
            $scope.endTime = (new Date()).format('Y-m-d H:i:s');
            var errorIds = '';
            if ($scope.errorQList.length) {
                errorIds = ($scope.errorQList.map(function (item) {
                    return item['ubint64_no']
                })).join(',');
            }
            var timeStr = $scope.activitiesTime;
            if ($scope.activitiesTime.split(':').length == 2) {
                timeStr = '00:' + timeStr;
            }
            App.sendMessage('保存中...');

            App.send('/saveScore', {
                type: 'post',
                data: {
                    'testbank_no': $scope.id,
                    'start_time': $scope.startTime,
                    'end_time': $scope.endTime,
                    'activities_time': timeStr,
                    'testbank_num': $scope.totalCount,
                    'integral': $scope.integral,
                    'stars': $scope.list.length,
                    'wrong_num': $scope.errorQList.length,
                    'wrong_words': errorIds,
                    'repractice': $scope.IsRepractice,
                    'homework_no': $scope.homework_no,
                    'testbank_name': $scope.testbankName,
                    'right_answer': JSON.stringify($scope.rightAns),
                    'wrong_answer': JSON.stringify($scope.errorAList),
                    'activities_no': 1,
                    'score_no': $scope.score_no
                },
                success: function (result) {

                    $('.js-enter-key').removeClass('disable');
                    if (result.errcode == 0) {
                        App.sendMessage('保存成功');
                        $('.js-game-finished').show();
                        $('.c-play-game').hide();
                        $scope.$apply(function () {
                            $scope.finishedAll = true;
                            $scope.integral += result.data.integral;
                            $scope.stars += $scope.list.length;
                            $scope.tagErrorList();
                            $scope.score_no = result.data.score_no;
                            $scope.rankList = result.data.rankList;
                            $scope.better = result.data.better;
                            if(!$scope.better){
                                $scope.isNo1 = true;
                            }else{
                                $scope.isNo1 = false;
                            }
                            App.postMessage({
                                taskname: 'refresh',
                                hwid: $scope.homework_no
                            });
                            if (result.data.quality == 0) {
                                App.sendMessage('作业不达标!');
                            }
                        });
                        $('.mask2').remove();
                        $('.win-correct').hide();
                        $('.win-error').hide();

                    } else {
                        App.sendMessage(result.errstr);
                    }
                }
            });


        };


        $scope.tagErrorList = function () {
            var tagStr = ($scope.errorQList.map(function (item) {
                return item['ubint64_no']
            })).join(',');;
            $.each($scope.list, function (idx) {
                if (tagStr.indexOf($scope.list[idx]['ubint64_no']) >= 0) {
                    $scope.list[idx]['result'] = 0;
                } else {
                    $scope.list[idx]['result'] = 1;
                }
            });
        }

        $scope.retry = function () {
            $('.preview-form').show();
            $('.js-game-finished').hide();
            $('.c-play-game').show();
            $scope.list = $scope.errorQList;
            $scope.errorQList = [];
            $scope.correctQList = [];
            $scope.errorAList = [];
            $scope.currentItem = 0;
            $scope.eid = $scope.list[0]['ubint64_no'];
            $scope.getDetail();
            $scope.recordTimeEvent();
            $scope.IsRepractice++;
        };



        $scope.finishItem = function () {
            $('.js-game-over-hd').prev().hide()
                .next().show();
            $scope.list = $scope.orgList;
        }

        $scope.viewDetailsEvent = function () {
            $('.js-page-first').show();
            $('.js-game-finished').hide();
            
        };
        
        $scope.cancelEvent = function() {
            $('.js-page-first').hide();
            $('.js-game-finished').show();  
            
        };

        $scope.finishGameEvent = function () {
            App.postMessage({
                hwid: $scope.homework_no,
                taskname: 'close'
            });
        }

        $scope.playAgain = function () {
            $route.reload();
        };





    }]);
});

