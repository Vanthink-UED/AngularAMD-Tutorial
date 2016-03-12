/*****
    based on jquery.picture.cut http://picturecut.tuyoshi.com.br/docs/
******/

$(function() {
    'use strict';
    var UploadLoading = (function(){
        var $loading = $('<div class="g-core-image-corp-loading"></div>');
        var timeSetter;
        return{
            show: function(msg,keep) {
                window.clearTimeout(timeSetter);
                this.hide();
                var me = this;
                $loading.text(msg || '上传中...');
                $('body').append($loading);
                if(keep){
                    return;
                }
                timeSetter = window.setTimeout(function(){
                    me.hide();
                },3000);
            },
            
            hide: function() {
                $loading.remove();
            }
            
        }; 
    }());
    window.UploadLoading = UploadLoading;
});
(function(a) {
    var f;
    a.fn.uploadAjax = function(g) {
        var b = a.extend({
            accept: /^(jpg|png|gif)/gi,
            acceptEx: "",
            name: "file",
            method: "POST",
            url: "/",
            data: !1,
            onSubmit: function() {
                return !0
            },
            onComplete: function() {
                return !0
            },
            extError: function() {
                return !1
            }
        }, g);
        return this.each(function() {
            var e = a(this);
            e.css("position", "relative");
            e.setData = function(a) {
                b.data = a
            };
            var c = a('<form  method="' + b.method + '" enctype="multipart/form-data" action="' + b.url + '"> <input name="' + b.name + '" type="file" accept="' + b.acceptEx + '" /></form>'),
                h = c.find("input[name=" + b.name + "]");
            console.log(b.name);
            h.css({
                display: "block",
                position: "absolute",
                left: 0,
                top: 0,
                width: e.width(),
                height: e.height(),
                "font-size": "100pt",
                cursor: "hand",
                opacity: 0,
                filter: "alpha(opacity=0)",
                "z-index": 10,
                overflow: "hidden"
            }).attr("title", '选择文件');
            h.on("change", function(d) {
                d = h.val().replace(/C:\\fakepath\\/i, "");
                d = d.substring(d.lastIndexOf(".") + 1);
                if (!b.accept.test(d)) {
                    return b.extError.call(e, this), c.get(0).reset(), !1
                }
                c.find("input[type=hidden]").remove();
                b.onSubmit.call(e, a(this));
                b.data && a.each(b.data, function(b, d) {
                    c.append(a('<input type="hidden" name="' + b + '" value="' + d + '">'))
                });
                c.submit();
                a(c).find("input[type=file]").attr("disabled", "disabled")
            });
            a(e).append(c);
            f || (f = a('<iframe id="picture-element-iframe" name="picture-element-iframe"></iframe>').attr("style", 'style="width:0px;height:0px;border:0px solid #fff;"').hide(), f.attr("src", ""), a(document.body).append(f));
            var g = function() {
                a(c).find("input[type=file]").removeAttr("disabled");
                var d = a(this).contents().find("html body").text();
                a(c).get(0).reset();
                b.onComplete.call(e, d);
                f.unbind()
            };
            c.submit(function(a) {
                f.load(g);
                c.attr("target", "picture-element-iframe");
                a.stopPropagation()
            })
        })
    };
})(jQuery);

(function($) {
    var methods = {
        clear: function(Options) {
            return this.each(function() {
                var InputOfImageDirectory = $(this).find(".picture-element-image-directory");
                InputOfImageDirectory.val("").change();
            });
        },
        init: function(Options) {
            var defaults = {
                extensions: [],
                actionToSubmitUpload: "",
                maximumSize: 1024,
                EnableMaximumSize: false,
                CropWindowStyle: "bootstrap",
                EnableButton: false,
                enableDrag: false,
                inputOfFile: 'file',
                
                uploadedCallback: function(response) {}
            };
    	
            var Options = $.extend(defaults, Options);
            if(Options.extensions.length == 0){
                return UploadLoading.show('文件扩展不能为空');
            }
            if(!Options.actionToSubmitUpload){
                return UploadLoading.show('"actionToSubmitUpload"必须指定上传地址');
            }
           
            return this.each(function() {
                var Elemento;
                
                
                   
                var initUpload = function(element) {
                    element.css({
                        "position": "relative",
                        "cursor": "pointer",
                        "overflow": "hidden"
                    }).addClass("g-core-image-upload-element");
                    // support drage
                    if(Options.enableDrag){
                         element.on('dragenter', function(e) {
                         if ($(e.target).attr("name") == Options.InputOfFile) {
                          //  element.css('border','4px solid red');
                            } else {
                               //   element.css('border','4px dashed #ccc');
                            };
                            e.stopPropagation();
                            e.preventDefault();
                        });
                        $(document).on('drop dragend', function(e) {
                          //  element.css('border','4px dashed #ccc');
                            e.stopPropagation();
                        });
                        element.on("mouseout", function(e) {
                          //  element.css('border','4px dashed #ccc');
                            e.stopPropagation();
                        });    
                    }
                   

                    var $inputHidden = $("<input type='hidden' name='" + Options.inputOfFile + "' id='" + Options.inputOfFile  + "'>");
                    $inputHidden.addClass("picture-element-image-directory");
                    element.append($inputHidden);
                  
                };
                var getExt = function(name) {
                    return name.slice(name.lastIndexOf(".") + 1);
                };
                var startAjaxUpload = function(element) {
                    var post = {};
                    post["request"] = "upload";
                    var CustomRegex = new RegExp("^(" + Options.extensions.join("|") + ")", "i");
                    element.uploadAjax({
                        accept: CustomRegex,
                        name: Options.inputOfFile,
                        method: 'POST',
                        url: Options.actionToSubmitUpload,
                        data: post,
                        onSubmit: function() {
                            UploadLoading.show('上传中...',1);
                        },
                        onComplete: function(response) {
                            response = JSON.parse(response);
                            UploadLoading.hide();
                            console.log(response.errno);
                            if(response.errno == '0'){
                                Options.uploadedCallback(response);    
                            }else{
                                UploadLoading.show(response.errmsg); 
                            }

                        },
                        extError: function() {
                            UploadLoading.show("文件类型不支持: " + (Options.extensions.join(",")).toString());
                        }
                    });
                    element.find(":file[name='" + Options.InputOfFile + "']").mouseenter(function() {
                        element.addClass("TuyoshiImageUpload_div")
                    }).mouseout(function() {
                        element.removeClass("TuyoshiImageUpload_div")
                    })
                };
                
                
                $elemenTo = $(this);
                initUpload($elemenTo);
                startAjaxUpload($elemenTo);
                if (Options.EnableButton) {
                    $EnableButton = $("<input type='button' value='Selecionar imagem' />").button().css({
                        "font-size": "12px",
                        "margin-top": 5,
                        "margin-left": "-0.5px"
                    });
                    Elemento.after($EnableButton);
                    $EnableButton.unbind("click").bind("click", function() {
                        Elemento.find("input[name='" + Options.InputOfFile + "']:file").click()
                    });
                }
            });
        }
    };
    $.fn.CoreUpload = function(MetodoOuOptions) {
        if (methods[MetodoOuOptions]){
            return methods[MetodoOuOptions].apply(this, Array.prototype.slice.call(arguments, 1)); 
        }else if (typeof MetodoOuOptions === 'object' || !MetodoOuOptions) {
            return methods.init.apply(this, arguments);  
        }
    };
})(jQuery);