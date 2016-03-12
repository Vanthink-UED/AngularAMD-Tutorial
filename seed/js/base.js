/***
    base.js 
    20121212
**/

;
(function () {
    var core = {
        date: 20141225,
        version: window.F_VERSION || 2015,
        debug: window.F_DEBUG == 0 ? false : true 
    };
    // 核心的配置
    core.config = {
        audioTime: 60 * 1000, // 记录音频时间限制
        
        audio: {
            bg: 'http://7xjgcu.media1.z0.glb.clouddn.com/FkoYvB1HcdcqpAsZifNsc9WNd2NG',
            ready: 'http://7xjgcu.media1.z0.glb.clouddn.com/FjVa951DDmSnUx4zWXVKunJHfmq-',
            click: 'http://7xjgcu.media1.z0.glb.clouddn.com/FrfvAwQRWqG7sOUPfnl6XeJVjPXk',
            gameOver: 'http://7xjgcu.media1.z0.glb.clouddn.com/Fs_Yi9LIpDIJXIZ1ApjYGx41bqRS',
            right:'http://7xjgcu.media1.z0.glb.clouddn.com/Fv6gq0l5keRZyn40rVCj-vvrx7jv',
            goOn: 'http://7xjgcu.media1.z0.glb.clouddn.com/FrcHlhehCC8waw3ZLUhTHtGfG2aL',
            wrong: 'http://7xjgcu.media1.z0.glb.clouddn.com/FjLxoIn00TkV8VEiO-16IKeLrEsE',
            reset: 'http://7xjgcu.media1.z0.glb.clouddn.com/FglI5ypHKiQtDIrMzTBfglbBaQJE',
            di: 'http://7xjgcu.media1.z0.glb.clouddn.com/vuede0a5b0e829c9ccb5f719a609b7fd9eb4.mp3'
        
        },
        
        api: '/HM3.0/api/',
        
        max_testbank_num: 100,
        
        timeout: 10000,
        
    };

    
    JS_ROOT = '/HM3.0/public/js/';


    // 防止链接的跳转
    $('.btn').live('click', function (e) {
        if (this.tagName.toLowerCase() == 'a') {
            e.preventDefault();
        }
    });


    /**
     * 将源对象的属性并入到目标对象
     * @method mix
     * @static
     * @param {Object} des 目标对象
     * @param {Object} src 源对象
     * @param {boolean} override (Optional) 是否覆盖已有属性。如果为function则初为混合器，为src的每一个key执行 des[key] = override(des[key], src[key], key);
     * @returns {Object} des
     */
    var mix = function (des, src, override) {
        if (typeof override == 'function') {
            for (var i in src) {
                des[i] = override(des[i], src[i], i);
            }
        } else {
            for (i in src) {
                //这里要加一个des[i]，是因为要照顾一些不可枚举的属性
                if (override || !(des[i] || (i in des))) {
                    des[i] = src[i];
                }
            }
        }

        return des;
    };

    // 辅助类
    core.Helper = {



        // 生成随机数字字符串
        random: function () {
            return ((new Date()).getTime() + Math.floor(Math.random() * 9999));
        },

        getQueryParams: function (q) {
            var url = location.href;
            q = q.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]"+q+"=([^&#]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec( url );
            return results == null ? null : results[1];
        }
    };



    var unserialize = function (serializedString) {
        if (!serializedString) {
            return {};
        }

        var str = decodeURI(serializedString);
        var pairs = str.replace(/\+/g, ' ').split('&');
        var obj = {},
            p, idx;

        for (var i = 0, n = pairs.length; i < n; i++) {
            p = pairs[i].split('=');
            idx = p[0];
            if (obj[idx] === undefined) {
                obj[idx] = unescape(p[1]);
            } else {
                if (typeof obj[idx] == "string") {
                    obj[idx] = [obj[idx]];
                }
                obj[idx].push(unescape(p[1]));
            }
        }

        return obj;
    };
    
    var serialize = function (obj) {
        if (!obj) {
            return '';
        }
        var arr = [];
        for(var key in obj){
            arr.push(key + '=' + obj[key]); 
        }

        return arr.join('&');
    };


    core.unserialize = unserialize;
    
    

    core.getGUID = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    function camelToDash(str) {
        return str.replace(/\W+/g, '-')
            .replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
    }

    function dashToCamel(str) {
        return str.replace(/\W+(.)/g, function (x, chr) {
            return chr.toUpperCase();
        });
    }

    function camelToUnderline(str) {
        return str.replace(/\W+/g, '_')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
    }
    
    core.UserCenter = (function () {
        var userid = '';
        var username = '';
        return {
            
            init: function () {
                userid = $('.g-userid').val().trim();
            
                username = $('.g-username').val().trim();
                if(userid == '' || !/^[0-9]+$/.test(userid) || username == ''){
                    //core.BoxManage.alert('警告','您还未登录即将跳往登录地方');
                    //this.login();
                    
                }
            },
            
            getUserid: function() {
                return userid;
            },
            
            getUsername: function() {
                return username;
            },
            
            login: function() {
                var redirect_url = decodeURIComponent(window.location.href);
                window.setTimeout(function() {
                    location = core.config.loginUrl + '?redirect_url=' + redirect_url;
                },3000);
            }
        } 
    }());
    
    // 平台统一接口调用
    
    core.OnlineGame = (function(){
        //to set default config
        
        var redirect_url = decodeURIComponent(window.location.href);
        
        
        var back_url = core.Helper.getQueryParams('redirect_url');
        var back_hash = core.Helper.getQueryParams('hash');
        var isPreview = core.Helper.getQueryParams('isPreview');
        var isPlay = core.Helper.getQueryParams('isPlay');

        
        if(back_hash) {
            back_url += '#' + back_hash;
        }
        back_url += '?appid=' + core.config.appid;

        
        return {
            
            init: function(){
                // get game mode
                document.domain = 'vanthink.cn';
                core.config.mode = core.Helper.getQueryParams('redirect_url')?1:0;
                if(core.config.mode == 1){
                   // $('.btn-return-home').text('返回平台');
                    $('.btn-return-home').on('click', function(e) {
                        e.preventDefault();
                        core.BoxManage.confirm('提示','确定放弃当前操作，跳回平台?', function() {
                            window.location = back_url;
                        });
                    });
                }
                
                if(isPreview || isPlay){
                     $('.g-aside').hide();
                }
                if(isPlay){
                    core.config.mode = 2;
                }
                
                if(isPreview){
                    core.config.mode = 3;
                }
                
            },
            
            submitScore: function(api,data,urlArgs,callback) {
                core.send(api,{
                    data: data,
                    success: function(){
                        if(callback !== undefined){
                            callback();
                        }
                        
                        
                    }
                });
            },
            
            redirect: function(data){
                console.log(data);
                if(typeof(data) == 'object'){
                    var paramStr = serialize(data);
                }
                back_url = decodeURIComponent(back_url);
                //console.log(back_url + '?activities_no=' + core.config.appid + '&' + paramStr);
                top.location =  back_url + '&activities_no=' + core.config.appid + '&' + paramStr;
            }
        }
        
        
    })();



    // angular 
    core.AG = (function () {
        var exports = {
            // @param 路由列表 
            autoConfig: function (r) {
                var t = r.replace('/', '');
                var c = dashToCamel(t + '-' + 'ctrl');
                c = c.replace(/^([a-z]{1})/, function ($1) {
                    return $1.toUpperCase()
                })
                var a = JS_ROOT + t + '.js';
                var s = location.search || location.hash.split('?')[1];
                return {
                    templateUrl: t.replace('-', '_') + '?' + s,
                    controller: c,
                    controllerUrl: a
                }

            }
        }

        return exports;
    }());


    core.generateClassName = function (className) {
        var str = '';

        str = camelToDash(className);

        var path = location.pathname.split('/');
        path[path.length - 1] = '';

        return 'c' + path.join('-') + str;　
    }

    core.generateJsName = function (className) {
        var str = '';
        str = camelToDash(className);
        return str + '.js';　
    }

    core.Route = function () {
        document.domain = 'vanthink.cn';
        var url = location.pathname.replace('/', '');


        return {
            getAppName: function () {
                return url;
            },

            getAppPath: function () {
                var path = location.pathname.split('/');
                path[path.length - 1] = '';
                return JS_ROOT + path.join('/').replace('/', '')

            }
        };
    }();



    core.sendMessage = function (msg, e) {
        var $dialog = $('<div class="message-box"></div>');
        $dialog.append(msg);
        if (e) {
            e.stopPropagation();
        }
        $('body').append($dialog);
        $("body").on('click', function (e) {
            //$dialog.remove();
        });

        window.setTimeout(function () {
            $dialog.remove();
        }, 2500);
    };


    core.BoxManage = function () {

        var defaultOptions = {
            "wrapId": 'transformers_win' + Math.random() * 10000,
            "className": "r-popup-box",
            "title": "标题",
            "header": '',
            "body": '',
            "footer": '',
            "overflow": 'auto',
            "withClose": true,
            "withCorner": false,
            "withCue": false,
            "withShadow": false,
            "withBgIframe": false,
            "keyEsc": false,
            "withMask": true,
            "dragable": true,
            "resizable": false,
            "posCenter": true,
            "posAdjust": true,
            'fixed': false,
            'maskClose': false,
            'template': '../common/window',
            'fn': "",
        };

        var options = {};

        $mask = $('<div class="mask"></div>')
        $box = $('<div class="over-layout"></div>');
        $viewBox = $('<div class="m-popup-win"></div>');
        $alertBox = $('<div class="alert-box"></div>');
        return {
            init: function () {
                var me = this;
                this.loadTemplate();


            },

            loadScript: function () {

                var url = JS_ROOT + 'controller/' + options.name.replace(/\_/g, '-') + '.js' + '?v=' + core.Helper.random();
                
                
//                requirejs([JS_ROOT + options.name.replace(/\_/g, '-') + '.js'], function () {
//                });

                $.getScript(url, function(data, textStatus, jqxhr){                    
                });

            },

            loadTemplate: function () {
                var me = this;
                var url = './index/' + options.name;
                if(options.data !== null && options.data !== undefined){
                    url += '?' +  serialize(options.data); 
                }
                $.get(url, function (result) {
                    if (result) {
                        $box.append(result);
                        me.loadScript();
                        me.bind();

                    }

                });
            },

            bind: function () {
                var me = this;
                $box.find('.btn-close').on('click', function (e) {
                    e.preventDefault();
                    me.hide();
                });
            },

             initAlertBox: function (fn) {
                var me = this;
                $alertBox.html('');
                
                if(options.text){
                    
                    var html = '<form class="m-form text-left"><div class="form-group">';
                    if(options.multiline){
                        html += '<textarea class="js-win-ask-text" placeholder="" style="width:90%">' + options.contents + '</textarea>';
                    }else{
                        html += '<input class="js-win-ask-text"  style="width:90%" value=' + options.contents + '>';
                    }
                        
                    html += '</div></form>'; 
                    $wrap = $('<div class="wrap"></div>').html(html);    
                
                }else{
                    $wrap = $('<div class="wrap"></div>').html(options.msg);
                }

                

                $btnClose = $('<a href class="icon icon-cancel-circle btn-close"></a>');
                $hd = $('<div class="hd"></div>').append(options.title, $btnClose);
                $ft = $('<div class="ft"></div>');
                $ok = $(' <button type="button" class="btn btn-primary">确定</button>');
                $cancel = $('<button type="button" class="btn btn-default">取消</button>');
                $ft.append($ok, $cancel);

                $alertBox.append($hd, $wrap, $ft);

                $btnClose.on('click', function () {
                    me.hide();
                });

                $cancel.on('click', function () {
                    me.hide();
                });
                if(options.text){
                    $ok.on('click', function () {
                        me.disable = false;
                        var text = $alertBox.find('.js-win-ask-text').val();
                        if (fn !== undefined) {
                            $.when(fn(text,me)).then(function(result){
                                if(!me.disable){
                                     me.hide();    
                                }        
                            });
                            
                           
                        } else {
                            me.hide();
                        }
                    });
                }else{
                    $ok.on('click', function () {
                        me.disable = false;
                        if (fn !== undefined) {
                             $.when(fn(me)).then(function(result){
                                if(!me.disable){
                                     me.hide();    
                                }        
                            });
                        } else {
                            me.hide();
                        }
                    });
                }

                

            },

            alert: function (title, msg, fn) {
                options.title = title;
                options.msg = msg;
                options.text = false;
                this.initAlertBox();
                
                $('body').append($mask);
                $('body').append($alertBox);
                $alertBox.addClass('show');
            },

            confirm: function (title, msg, fn) {
                options.title = title;
                options.msg = msg;
                options.text = false;
                this.initAlertBox(fn);
                
                $('body').append($mask);
                $('body').append($alertBox);
                $alertBox.addClass('show');
            },

            ask: function (title, source, fn, args) {
                options.title = title;
                options.text = options.text || true;
                options.multiline = args.multiline  || false;
                options.contents = args.contents  || '';
                options.msg = core.getTemplate(source);
                this.initAlertBox(fn);
                $('body').append($mask);
                $('body').append($alertBox);
                $alertBox.addClass('show');
            },
            
            view: function(title,templateName,data,fn){
                var me = this;
                var html = core.Template.getContents(templateName,data);
                
                options.title = title;
                
                $viewBox.html('');
                $viewBox.append('<h3>' + title + '</h3>','<a class="btn-icon pull-righ btn-close">隐藏</a>',html);
                $('body').append($viewBox);
                $viewBox.addClass('show');
                $viewBox.find('.btn-close').on('click', function (e) {
                    e.preventDefault();
                    me.hide();
                });
            
            },
            


            show: function (args, $scope) {
                options = args;
                var name = options.name;
                options.name = camelToUnderline(args.name);
                mix(options, defaultOptions);

                if (!options.name) {
                    return;
                }
                $box.addClass(core.generateClassName(name));
                $('body').append($mask);
                $('body').append($box);
                $box.html('');
                //$box.append('<a href class="btn btn-close">关闭</a>')
                $box.addClass('show');

                this.init();


            },



            hide: function () {
                $box.remove();
                $viewBox.remove();
                $alertBox.remove();
                $mask.remove();
            }



        };
    }();

    core.send = function (url, options) {
        var ajaxOptions = {
            url:  url,
            type: 'GET',
            timeout: 10000,
            dataType: 'json',
            error: function(){
                App.LoadingSpinner.hide();
                App.sendMessage('系统繁忙，请稍候重试');
            }
        };
        options = options || {};
        if ($.isFunction(options.fn)) {
            options.__TFCallback = options.fn;
            delete options.fn;
        }
        options.url =  core.config.api +url;
        mix(ajaxOptions, options, true);

        if ($.type(ajaxOptions.data) == 'object') {
            var el = $(ajaxOptions.data);
            var tagName = el.prop('tagName');

            if (tagName && tagName.toLowerCase() == 'form') {
                ajaxOptions.data = el.serialize();
            }
        }
        
        if(ajaxOptions['success']){
            var cb = ajaxOptions['success'];
            ajaxOptions['success'] = function(result){
                if(result.errcode == 101){
                    location = 'index/login';
                }else{
                    cb(result);
                }
            }
        }

        if (!ajaxOptions.hasCache && ajaxOptions.type == 'GET') {
            ajaxOptions.data = ajaxOptions.data || {};
            if (typeof (ajaxOptions.data) == 'string') {
                //ajaxOptions.data = unserialize(ajaxOptions.data);
            }
            ajaxOptions.data['_reqno'] = core.Helper.random();
        }
        var path = location.pathname.split('/');
        path[path.length - 1] = url;
        if (core.debug) {
            console.debug('HTTP Finished: http://' + location.host + path.join('/'));
        }
        return $.ajax(ajaxOptions);

        /*
        // 如果已经发送请求，则取消上一个请求
        var requestName = url;
        var currentRequester = this.sendRequester.get(requestName);
        if (currentRequester) {
            currentRequester.abort();
        }

        ajaxOptions.context.options = ajaxOptions;

        currentRequester = $.ajax(ajaxOptions);

        this.sendRequester.set(requestName, currentRequester);

        if (options.loadingMsg !== false) {
            this.setLoadingMsg(options.loadingMsg);
        }

        return currentRequester;*/
    };
    
    core.getTemplate = function (source_id, data) {
        var bt = baidu.template;
        var data = data || {};
        var html = baidu.template(source_id, data);
        return html;

    };

   
    core.Template = {
        page: function (templateName, options, page) {
            var me = this;
            $pageList = $('<ul class="pagination-sm"></ul>');
            options.data['pageno'] = page || 1;
            var $temTarget;
            core.send(options.name, {
                data: options.data,
                success: function (result) {
                    if (result.errcode == 0) {
                        if (page === undefined) {
                            var pageNum = Math.ceil(result.data['count'] / result.data['pagesize']);
                            console.log(pageNum);
                            $temTarget = $(me.getContents(templateName, result));
                            $('.target-' + templateName).append($temTarget, $pageList);
                            me.initPage($pageList, pageNum, function (page) {
                                me.page(options, templateName, page);
                            });
                        } else {
                            $temTarget.replaceWith(me.getContents(templateName, result));
                        }

                    } else {
                        core.sendMessage(result.errstr);
                    }
                }
            })

        },

        initPage: function (selector, pageNum, callback) {
            $pageList.twbsPagination({
                totalPages: pageNum,
                first: '首页',
                last: '最后',
                next: '&#187;',
                prev: '&#171;',
                onPageClick: function (event, page) {
                    callback(page);
                }
            });
        },

        render: function (templateName, data) {
            var bt = baidu.template;
            var html = baidu.template('template-' + templateName, data);
            $('.target-' + templateName).html(html);
            
        },

        getContents: function (templateName, data) {
            var bt = baidu.template;
            var data = data || {};
            var html = baidu.template('template-' + templateName, data);
            return html;
        }
    };


    // tab view
    core.TabView = function () {


    };

    core.dataTable = function () {


    };

    core.Form = (function () {
        if ($.validator) {


        }

        return {
            // @param selector
            validate: function (selector) {
                selector = selector || '.form-validation';
                if (this.validateConfig()) {
                    $(selector).validate();
                }

            },

            validateConfig: function () {
                if ($.validator) {
                    $.extend($.validator.messages, {
                        required: function (value, element) {
                            var str = element.getAttribute('required');
                            var result = '此项必填';
                            var prefix;

                            if (str) {
                                switch (element.tagName.toLowerCase()) {
                                case 'select':
                                    prefix = '请选择';
                                    break;

                                default:
                                    var type = element.getAttribute('type').toLowerCase();

                                    if (type == 'radio' || type == 'checkbox') {
                                        prefix = '请选择';
                                    } else {
                                        prefix = '请填写';
                                    }

                                    break;
                                }

                                result = prefix + str;
                            }

                            return result;
                        },
                        remote: "请修正此栏位",
                        email: "电子邮件地址无效",
                        url: "请输入有效的网址",
                        date: "请输入有效的日期",
                        dateISO: "请输入有效的日期 (YYYY-MM-DD)",
                        number: "请输入正确的数字",
                        digits: "只可输入数字",
                        creditcard: "请输入有效的信用卡号码",
                        equalTo: "你的输入不相同",
                        notEqualTo: '不能重复上面内容',
                        extension: "请输入有效的后缀",
                        maxlength: $.validator.format("最多 {0} 个字"),
                        minlength: $.validator.format("最少 {0} 个字"),
                        rangelength: $.validator.format("请输入长度为 {0} 至 {1} 之間的字串"),
                        range: $.validator.format("请输入 {0} 至 {1} 之间的数值"),
                        max: $.validator.format("请输入不大于 {0} 的数值"),
                        min: $.validator.format("请输入不小于 {0} 的数值"),
                        regex: $.validator.format("请检查输入格式")
                    });

                    // 设置全局配置
                    $.validator.setDefaults({
                        errorPlacement: function (error, element) {
                            var el = $(element).closest('.form-group').find('em');

                            if (el.length > 0) {
                                el.replaceWith(error);
                            } else {
                                error.insertAfter(element);
                            }

                            element.focus(function () {
                                error.hide();
                            });
                        },
                        errorElement: 'em',
                        debug: false,
                        onfocusout: function (element) {
                            this.element(element);
                        }
                    });

                    $.validator.methods.equalTo = function (value, element, param) {
                        var target;
                        var el = $(element).closest('form');

                        if (el.length > 0) {
                            target = el.find(param);
                        } else {
                            target = $(param);
                        }

                        if (this.settings.onfocusout) {
                            target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
                                $(element).valid();
                            });
                        }

                        return value === target.val();
                    };

                    $.validator.methods.notEqualTo = function (value, element, param) {
                        var target;
                        var el = $(element).closest('form');

                        if (el.length > 0) {
                            target = el.find(param);
                        } else {
                            target = $(param);
                        }

                        if (this.settings.onfocusout) {
                            target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
                                $(element).valid();
                            });
                        }

                        return value !== target.val();
                    };

                    //add regular expression
                    $.validator.methods.regex = function (value, element, regstring) {
                        if (this.optional(element)) {
                            return true;
                        }

                        var regParts = regstring.match(/^\/(.*?)\/([gim]*)$/);
                        if (regParts) {
                            var regexp = new RegExp(regParts[1], regParts[2]);
                        } else {
                            var regexp = new RegExp(regstring);
                        }

                        return regexp.test(value);
                    };


                    return true;
                } else {
                    return false;
                }
            }


        }

    }());


    core.Array = (function () {

        var exports = {
            findItem: function (item, arr,key) {

                for (var i = 0; i < arr.length; i++) {
                    if(key){
                        if (arr[i][key] == item[key]) {
                            return i;
                        }
                    }else{
                        var j = arr[i];
                        if(typeof(j) == 'object'){
                            if(JSON.stringify(j) == JSON.stringify(item)){
                                return i;
                            }    
                        }else{
                            if(j == item){
                                return;
                            }
                        }
                        
                    }
                    
                }
                return false;

            },

            addItem: function (item, arr,key) {
                if (this.findItem(item, arr,key) || this.findItem(item, arr, key) === 0) {
                    return;
                } else {
                    arr.push(item);
                }
            },

            removeItem: function (item, arr, key) {
                if(this.findItem(item, arr,key) === false){
                    return;
                }
                arr.splice(this.findItem(item, arr, key), 1);
            },

            concat: function(arr1,arr2) {
                return this.unique(arr1.concat(arr2));
            },
            
            shuffle: function(array) {
                var currentIndex = array.length;
                var temporaryValue, randomIndex ;

                while (0 !== currentIndex) {

                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;


                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            },

            unique: function(arr) {
                var a = arr.concat();
                for(var i=0; i<a.length; ++i) {
                    for(var j=i+1; j<a.length; ++j) {
                        if(a[i] === a[j])
                            a.splice(j--, 1);
                    }
                }

                return a;
            }


        };

        return exports;

    }());
    
    
    Date.prototype.format = function(format) {
        var returnStr = '';
        var replace = Date.replaceChars;
        for (var i = 0; i < format.length; i++) {       var curChar = format.charAt(i);         if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
                returnStr += curChar;
            }
            else if (replace[curChar]) {
                returnStr += replace[curChar].call(this);
            } else if (curChar != "\\"){
                returnStr += curChar;
            }
        }
        return returnStr;
    };

    Date.replaceChars = {
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

        // Day
        d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
        D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
        j: function() { return this.getDate(); },
        l: function() { return Date.replaceChars.longDays[this.getDay()]; },
        N: function() { return this.getDay() + 1; },
        S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
        w: function() { return this.getDay(); },
        z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
        // Week
        W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
        // Month
        F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
        m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
        M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
        n: function() { return this.getMonth() + 1; },
        t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
        // Year
        L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
        o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
        Y: function() { return this.getFullYear(); },
        y: function() { return ('' + this.getFullYear()).substr(2); },
        // Time
        a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
        A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
        B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
        g: function() { return this.getHours() % 12 || 12; },
        G: function() { return this.getHours(); },
        h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
        H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
        i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
        s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
        u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
    '0' : '')) + m; },
        // Timezone
        e: function() { return "Not Yet Supported"; },
        I: function() {
            var DST = null;
                for (var i = 0; i < 12; ++i) {
                        var d = new Date(this.getFullYear(), i, 1);
                        var offset = d.getTimezoneOffset();

                        if (DST === null) DST = offset;
                        else if (offset < DST) { DST = offset; break; }                     else if (offset > DST) break;
                }
                return (this.getTimezoneOffset() == DST) | 0;
            },
        O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
        P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
        T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
        Z: function() { return -this.getTimezoneOffset() * 60; },
        // Full Date/Time
        c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
        r: function() { return this.toString(); },
        U: function() { return this.getTime() / 1000; }
    };







    core.LoadingSpinner = (function () {
        var $spinner = $('<div class="g-spinner-wrap"><div class="msg"></div><svg class="spinner" width="33px" height="33px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="5" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg></div>');
        //$spinner.css('display','none');

        return {
            //
            show: function (selector,msg) {
                $spinner.find('.msg').text(msg);
                $(selector || 'body').append($spinner);
            },

            hide: function () {
                $spinner.find('.msg').text('');
                $spinner.remove();
            },
            appendInline: function(selector) {
                $spinner = $(core.config.inlineLoader);
                $(selector||'body').append($spinner);
            }
        };

    })();
    
    


    //localStroage
    core.LocalStorage = (function () {
        var LS = localStorage;

        return {
            setKey: function (keyStr, data) {
                if( data !== null && (typeof(data) == 'object' || typeof(data) == 'array')){
                    data = JSON.stringify(data);
                }
                LS.setItem(keyStr, data);
            },

            removeKey: function (keyStr) {
                LS.setItem(keyStr, null);
            },

            getKeyVal: function (keyStr) {
                var val = LS.getItem(keyStr);
                if(val == undefined || val == ''){
                    return '';
                }
                return JSON.parse(val); 
            }
        };
    }());


    $('.g-button-list  a').on('click', function (e) {
        $(e.target).parents('.nav-list').find('a.active').removeClass('active');
        if (e.target.href == '#') {
            e.preventDefault();
        }
        if(location.hash.indexOf('game')>=0){
            if(!window.confirm('确定放弃游戏')){
                return false;
            }
        }
        $(this).addClass('active');
    });
    

    
    
    core.Audio = (function(){
        //var audio = document.getElementById('g-audio');
        return{
                  
            play: function(src){
                var audio = document.getElementById('g-audio');
                if(src == undefined){
                    src = 'bg';
                }
                src = core.config.audio[src] || src;
                var src = src || core.config.bgMusic;
                if(src !== audio.src){
                    audio.src = src;
                    audio.loop = false;
                }
                
                audio.play();
            },
                
            pause: function(){
                 var audio = document.getElementById('g-audio');
                audio.pause(); 
            },
            
            playBackgroundMusic: function(){
                 var audio = document.getElementById('g-audio');
                if(audio.src == core.config.audio.bg){
                    return;
                }
                audio.src = core.config.audio.bg;
                audio.loop = true;
                audio.play();
            }
            
            
                  
                  
        };
                  
  
                  
                  
    }());


    core.reload = function () {
        location.reload();
    }
        // 全局音乐控制  $btn 控制按钮
    core.audioContainer = function (eleClass, src, options) {
        if (core.debug) {
            console.log(eleClass);
        }
        var audio = document.getElementById('g-audio');
        if (!src) {
            return auid.pause();
        }
        audio.src = src;
        this.element = eleClass;
        this.audio = audio;
        this.btn = $(eleClass);
        this.init();

    };

    core.audioContainer.prototype = {
        init: function () {
            this.bind();
            this.play();
        },

        bind: function () {
            var me = this;
            $('.page-view').delegate(this.element, 'click', function (e) {
                me.btn = $(this);
                if ($(this).find('span').hasClass('fui-mute')) {
                    me.stop();
                } else {
                    me.play();
                }
            });
        },

        play: function () {
            this.btn.find('span').attr('class', 'fui-mute');
            this.audio.play();
        },

        stop: function () {
            this.btn.find('span').attr('class', 'fui-volume');
            this.audio.pause();
        },

        changeSrc: function (src) {
            this.audio.src = src;
            this.play();
        }


    };
    
    core.postMessage = function(data) {
        if(parent && data){
            parent.postMessage(data,'*');
        }
    }
    $(document).ready(function() {
        core.UserCenter.init();
        core.OnlineGame.init();
    });
    
    
    window.App = core;
    window.Vanthink = core;

}());
