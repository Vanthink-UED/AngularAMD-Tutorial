var H = {
    CONFIG: {
        ScrollLink: "#js_scroll_link"
    }
};

H.Scroll = (function(){
    var _cache = {}, _focus = "focus", 
    _timer, _start = 0, _end = 0, _speed = 5, _moveNum = 30, 
    _warp, _height = 0, _oldInd = 0, _openKey = true, _callback;
    
    if($.browser.msie && $.browser.version == 8){
        _speed = 1;
        _moveNum = 70;
    }
    
    
    
    var gotoScroll = function(){
        if(_start != _end){
            _openKey = false;
            _timer = window.setTimeout(function(){
                var val = _start + _moveNum;
                var isless = true;
                if(_start > _end){
                    val = _start - _moveNum;
                    isless = false;
                }
                _start = val;
                if(isless){
                    if(_start > _end){
                        _start = _end;
                    }
                }
                else{
                    if(_start < _end){
                        _start = _end;
                    }
                }
                _warp.scrollTop(_start);
                if(_start != _end){
                    gotoScroll();
                }
                else{
                    _openKey = true;
                    if(_timer) window.clearTimeout(_timer);
                    if(_callback){
                        _callback();
                        _callback = null;
                    }
                }
            }, _speed);
        }
        else{
            if(_timer){
                window.clearTimeout(_timer);
            }
            _openKey = true;
            _start = _end = 0;
        }
    }
    
    var listen = function(){
        var timer;
        var listenFun = function(){
            timer = window.setTimeout(function(){
                var st = _warp.scrollTop();
                var ind = 0;
                if(_height > 0){
                    ind = Math.floor(st / _height);
                }
                if(ind != _oldInd){
                    if(_cache.list[_oldInd]){
                        _cache.list[_oldInd].Tab.removeClass("focus");
                    }
                    if(_cache.list[ind]){
                        _cache.list[ind].Tab.addClass("focus");
                    }
                    _oldInd = ind;
                    if(_oldInd == 0){
                        _cache.scrollLink.hide();
                    }
                    else{
                        _cache.scrollLink.show();
                    }
                }
                if(timer) window.clearTimeout(timer);
                listenFun();
            }, 16);
        }
        listenFun();
    }
    
    var move = function(ind){
        if(_cache.list && _cache.list[ind]){            
            var item = _cache.list[ind];
            var con = item.Content;
            var t = con.offset().top;
            _start = _warp.scrollTop();
            _end = t - _cache.list[0].Content.offset().top;
            if(_openKey){
                gotoScroll();
            }
        }
    }
    
    var bind = function(){
        if(_cache.list){
            for(var i = 0, len = _cache.list.length; i < len; i++){
                var item = _cache.list[i];
                item.Tab.on("click", {
                    ind: i
                }, function(e){
                    var ind = e.data.ind;
                    move(ind);
                    return false;
                })
            }
            listen();
            
            
            _warp.bind("mousewheel",function(e){
                //褰撴粴杞悜涓嬫粴鐨勬椂鍊� e.wheelDelta = -120,鍚戜笂婊歟.wheelDelta = 120
                var ind;
                if($.browser.msie){
                    event.returnValue = false;
                }
                if(!$.browser.msie){
                    e.preventDefault();
                }
                if(event.wheelDelta < 0){
                    ind = _oldInd + 1;
                    if(ind < _cache.list.length){
                        move(ind);
                    }
                    else{
                        event.returnValue = true;
                    }
                }
                else{
                    ind = _oldInd - 1;
                    if(ind >= 0){
                        move(ind);
                    }
                }
            })
            
            _warp.bind("DOMMouseScroll",function(e){
                //褰撴粴杞悜涓嬫粴鐨勬椂鍊� e.detail= 3,鍚戜笂婊歟.detail = -3
                var ind;
                if(e.detail == 3){
                    ind = _oldInd + 1;
                    if(ind < _cache.list.length){
                        move(ind);
                    }
                }
                else if(e.detail == -3){
                    ind = _oldInd - 1;
                    if(ind > 0){
                        move(ind);
                    }
                } 
            })
            
            $(window).on("resize", function(){
                if(_resizeTimer) window.clearTimeout(_resizeTimer);
                _resizeTimer = window.setTimeout(function(){
                    if(_cache.list && _cache.list.length){
                        _height = _cache.list[0].Content.height();
                    }
                    move(_oldInd);
                    if(_resizeTimer) window.clearTimeout(_resizeTimer);
                }, 100);
                
            })
        }
        
        
    }
    
    var _resizeTimer;
    
    
    return {
        Init: function(warp, list){
            _warp = warp;
            _cache.list = list;
            _cache.scrollLink = $(H.CONFIG.ScrollLink);
            if(_cache.list.length){
                _height = _cache.list[0].Content.height();
            }
            bind();
        },
        Move: function(ind, callback){
            move(ind);
            _callback = callback;
        }
    }
})();

H.Login = (function(){
    
    var _cache = {};
    
    var checkInputVal = function(){
        if(_cache.inputs){
            for(var i = 0, len = _cache.inputs.length; i < len; i++){
                var input = _cache.inputs[i];
                var label = input.prev();
                if(input.val() != ""){   
                    label.css("display") == "none" || label.hide();
                }
            }
        }
    }
    
    var checkFun = function(input){
        var val = input.val();
        var type = input.attr("errortype");
        switch(type){
            case "notempty":
                if($.trim(val) == ""){
                    return false;
                }
                if(input.attr("minlen") && val.length < Number(input.attr("minlen"))){
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    var showMsg = function(input, error_msg){
        var par = input.parent();
        var hint = par.find(".popup-hint");
        var msg = input.attr("errmsg");
        if(!hint.length){
            hint = $('<div class="popup-hint">'+msg+'</div>');
            par.append(hint);
        }
        if(error_msg){
            msg = error_msg;
        }
        hint.html(msg);
        hint.show();
        
    }
    
    var hideMsg = function(input){
        var par = input.parent();
        var hint = par.find(".popup-hint");
        if(hint.length){
            hint.hide();
        }
    }
    
    var bindInput = function(input){
        input.on("focus", function(){
            var label = input.prev();
            label.hide();
            
        }).on("blur", function(){
            blurLabel(input);
        })
    }
    
    var blurLabel = function(input){
        var label = input.prev();
        if(input.val() == ""){
            label.show();
        }
        else{
            label.hide();
            //Check is account
            if(input.attr("id") == "account"){
                checkAccount(input);
            }
            
        }
    }
    
    var checkAccount = function(input){
        input.attr("is_loading", "1");
        var key = "JS_API_MOBILE";
        var val = input.val();
        if(val){
            $.getScript(window["PATHS_PASSPORT"] + "/?ct=ajax&ac=ajax_get_mobile&account="+encodeURIComponent(val)+"&js_return=" + key, function(){
                var res = window[key];
                var msg;
                if(res && res.state){
                    //Show has mobile
                    if(!res.message){
                        var par = input.parent();
                        var hint = par.find(".popup-hint");
                        if(hint.length){
                            hint.hide();
                        }
                        return;
                    }
                    msg = '<i class="ico-mobile"></i>鎮ㄥ彲浠ョ敤鎵嬫満鍙�' + res.message + '鐧诲綍';

                }
                else{
                    //Show no mobile
                    msg = '<i class="ico-mobile"></i>浣犵殑甯愬彿杩樻病鏈夌粦瀹氭墜鏈哄彿锛�<a href="' + window["PATHS_PASSPORT"] + '/?ct=mobile&ac=bind">绔嬪嵆缁戝畾</a>';
                }
                var par = input.parent();
                var hint = par.find(".popup-hint");
                if(!hint.length){
                    hint = $('<div class="popup-hint hint-icon"></div>');
                    par.append(hint);
                }

                hint.html(msg).show();

            });
        }
        else{
            var par = input.parent();
            var hint = par.find(".popup-hint");
            if(hint.length){
                hint.hide();
            }
        }
    }
    
    return {
        Init: function(form){
            var account = $("#account"), pwd = $("#passwd");
            _cache.inputs = [account, pwd];
            
            bindInput(account);
            bindInput(pwd);

            for(var i = 0, len = _cache.inputs.length; i < len; i++){
                var ele = _cache.inputs[i];
                ele.on("keydown", function(){
                    hideMsg($(this));
                })
            }
            
            form.on("submit", function(){
                var res = true;
                var firstDom;
                for(var i = 0, len = _cache.inputs.length; i < len; i++){
                    var ele = _cache.inputs[i];
                    if(!checkFun(ele)){
                        showMsg(ele);
                        res = false;
                        if(!firstDom){
                            firstDom = ele;
                        }
                    }
                    else{
                        hideMsg(ele);
                    }
                }
                if(firstDom){
                    firstDom.focus();
                }
                return res;
            });
            
            window.setInterval(checkInputVal, 100);
        },
        Focus: function(){
            var input = $("#account");
            input.select();
            showMsg(input);
        },
        Blur: function(input){
            blurLabel(input);
        },
        ShowMsg: function(input, msg){
            showMsg(input, msg);
        },
        HideMsg: function(input){
            hideMsg(input);
        }
    }
})();

H.Introduce = (function(){
    var shade_box, _box;
    return {
        Play: function(){
            if(!shade_box){
                shade_box = $('<div class="shade-box"></div>');
                $(document.body).append(shade_box);
                shade_box.on("click", function(){
                    shade_box.hide();
                    if(_box){
                        _box.empty().remove();
                        _box = false;
                    }
                })
            }

            var html = [];
            var swf = 'http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XMzYxODMzNjQ4=&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0';
            var w = 550, h = 350;
            
            html.push('<div class="player-box">');
            html.push('<a href="javascript:;" class="close">鍏抽棴</a><div class="player-wrap">');
            if($.browser.msie){
                html.push('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+w+'" height="'+h+'" name="js_flash_main">');
                html.push('<param name="movie" value="' + swf + '" />');
                html.push('<param name="quality" value="high" />');
                html.push('<param name="allowScriptAccess" value="sameDomain" />');
                html.push('<param name="wmode" value="transparent" />');
                html.push('</object>');
            }
            else{
                html.push('<object type="application/x-shockwave-flash" data="' + swf + '" width="'+w+'" height="'+h+'">');
                html.push('<param name="quality" value="high" />');
                html.push('<param name="allowScriptAccess" value="sameDomain" />');
                html.push('<param name="wmode" value="transparent" />');
                html.push('</object>');
            }
            html.push('</div></div>');

            shade_box.show();
            _box = $(html.join(""));

            _box.find("a").on("click", function(){
                shade_box.hide();
                _box.empty().remove();
                _box = false;
                return false;
            });
            _box.hide();

            $(document.body).append(_box);
            _box.fadeIn(500);
        }
        
    }
})();

H.Common = (function(){
    
    return {
		FestivalLogo: function(obj){
			if(obj.logo && obj.box && obj.background){
				for(var i = 0; i < obj.logo.length; i ++){
					var logo = obj.logo[i].festival,
					thisTime = Date.parse(new Date()),
					start = Date.parse(obj.logo[i].startDate),
					end = Date.parse(obj.logo[i].endDate);
					
					if(thisTime > start && thisTime < end){
						
						swf = "http://www.115.com/static/images/festival/" + logo + ".swf"
						w = 365,
						h = 80;
						var flash = [];
						if($.browser.msie){
							flash.push('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + w + '" height="' + h + '">');
							flash.push('<param name="movie" value="' + swf + '" />');
						}
						else{
							flash.push('<object type="application/x-shockwave-flash" data="' + swf + '" width="' + w + '" height="' + h + '">');
						}
						flash.push('<param name="quality" value="high" />');
						flash.push('<param name="wmode" value="transparent" />');
						flash.push('<param name="menu" value="false">');
						flash.push('</object>');
						
						obj.box.html(flash.join("")).show();
						
						if(obj.logo[i].transparent){
							obj.background.show();
						}
						else{
							obj.background.hide();
						}
					}
				}
			}
		},
        Crab: function(obj){
            if(obj.crabBox && obj.crabHub && obj.sideLeft && obj.sideRight && obj.distance && obj.duration){
							
                var direction = -1;
                var hoverClass = "hover", activeClass = "active";
                if(obj.hoverClass){ 
                    hoverClass = obj.hoverClass;
                }
                if(obj.activeClass){
                    activeClass = obj.activeClass;
                }
							
                var runAway = function(){
                    obj.crabBox.addClass(activeClass);
                    var posX = obj.crabBox.position().left;
                    if((posX - obj.distance) < obj.sideLeft){
                        direction = 1;
                    }
                    else if((posX + obj.distance) > obj.sideRight){
                        direction = -1;
                    }
                    obj.crabBox.stop().animate({
                        left: posX + direction * obj.distance + "px"
                    }, obj.duration, function(){
                        obj.crabBox.removeClass(activeClass);
                        obj.crabBox.addClass(hoverClass);
                        window.setTimeout(function(){
                            obj.crabBox.removeClass(hoverClass);
                        }, 600);
                    });
                }
                obj.crabHub.bind({
                    mouseover: function(){
                        obj.crabBox.addClass(hoverClass);
                    },
                    mouseout: function(){
                        obj.crabBox.removeClass(hoverClass);
                    },
                    click: function(){
                        runAway();
                    }
                })
            }
        },
        Share: function(lis){
            var timer, stop = false, active = 0;              
            var listen = function(){
                timer = window.setTimeout(function(){
                    if(!stop){
                        var span = $(lis[active]);
                        span.hide();

                        active++;
                        if(active >= lis.length){
                            active = 0;
                        }
                        var item = $(lis[active]);
                        span = item;
                        span.fadeIn(500);
                    }
                    if(timer) window.clearTimeout(timer);
                    listen();
                }, 4000);
            }
            listen();

        /*lis.each(function(i){
               $(this).on("mouseover", {ind: i}, function(e){
                    stop = true;

                    active = e.data.ind;

                    lis.hide();

                    var item = $(lis[active]);
                    var span = item;
                    span.fadeIn(500);

               }).on("mouseout", {ind: i}, function(e){
                    stop = false;
               }); 
            })*/
        }
    }
})();