/*****
    based on jquery.picture.cut http://picturecut.tuyoshi.com.br/docs/
******/

$(function() {
    'use strict';
    var ImageUploadLoading = (function(){
        var $loading = $('<div class="g-core-image-corp-loading"></div>');
        var timeSetter;
        return{
            show: function(msg) {
                window.clearTimeout(timeSetter);
                this.hide();
                var me = this;
                $loading.text(msg || '上传中...');
                $('body').append($loading);
                timeSetter = window.setTimeout(function(){
                    me.hide();
                },3000);
            },
            
            hide: function() {
                $loading.remove();
            }
            
        }; 
    }());
    window.ImageUploadLoading = ImageUploadLoading;
});
/**********************************************************************************
            uploadAjax plugin para jQuery
            Copyright (c) 2013 Tuyoshi Vinicius (tuyoshi_vinicius@hotmail.com))
            Version: 1.3
***********************************************************************************/
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
            }).attr("title", "选择文件");
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
    }
})(jQuery);
/**********************************************************************************
            PictureCut plugin para jQuery
            Copyright (c) 2013 Tuyoshi Vinicius (tuyoshi_vinicius@hotmail.com))
            Version: 1.1
***********************************************************************************/
(function($) {
    var methods = {
        clear: function(Options) {
            return this.each(function() {
                var InputOfImageDirectory = $(this).find(".picture-element-image-directory");
                InputOfImageDirectory.val("").change()
            })
        },
        init: function(Options) {
            var OptionsIfEmpty = {
                actionToSubmitUpload: "src/php/upload.php",
                actionToSubmitCrop: "src/php/crop.php",
                DefaultImageButton: "src/img/icon_add_image2.png"
            };
            var defaults = {
                Extensions: ['jpg','jpeg','gif','bmp','png'],
                InputOfImageDirectory: "image",
                InputOfImageDirectoryAttr: {},
                InputOfFile: "",
                actionToSubmitUpload: "",
                actionToSubmitCrop: "",
                DataPost: {},
                enableCrop: false,
                EnableResize: true,
                MinimumWidthToResize: 1024,
                MinimumHeightToResize: 630,
                MaximumSize: 1024,
                EnableMaximumSize: false,
                CropWindowStyle: "bootstrap",
                ImageNameRandom: true,
                EnableButton: false,
                CropModes: {
                    widescreen: true,
                    letterbox: true,
                    free: true
                },
                cropRatio:'16:9',
                cropSize:1,
                CropOrientation: true,
                uploadedCallback: function(response) {}
            };

            
            var Options = $.extend(defaults, Options);
            var ImageBoxObj = {};
            if (Options.CropModes != undefined){
                Options.CropModes = $.extend(defaults.CropModes, Options.CropModes);
            }
            

            Options.actionToSubmitUpload = (Options.actionToSubmitUpload == "") ?  OptionsIfEmpty.actionToSubmitUpload : Options.actionToSubmitUpload;
            Options.actionToSubmitCrop = (Options.actionToSubmitCrop == "") ?  OptionsIfEmpty.actionToSubmitCrop : Options.actionToSubmitCrop;
            Options.DefaultImageButton = (Options.DefaultImageButton == "") ? Options.PluginFolderOnServer + OptionsIfEmpty.DefaultImageButton : Options.DefaultImageButton;
            Options.CropWindowStyle = Options.CropWindowStyle.toLowerCase();
            if (Options.InputOfFile == "") {
                Options.InputOfFile = "file-" + Options.InputOfImageDirectory
            };
            if (Options.PastaCrop != undefined){
                Options.PluginFolderOnServer = Options.PastaCrop;
            } 
           

            return this.each(function() {
                var Elemento;
                
                
                   
                var initUpload = function(element) {
                    element.css({
                        "cursor": "pointer",
                        "overflow": "hidden"
                    }).addClass("g-core-image-upload-element");
                    // support drage
                    element.on('dragenter', function(e) {
                        if ($(e.target).attr("name") == Options.InputOfFile) {
                            element.addClass("picture-dropped")
                        } else {
                            element.removeClass("picture-dropped")
                        };
                        e.stopPropagation();
                        e.preventDefault()
                    });
                    $(document).on('drop dragend', function(e) {
                        element.removeClass("picture-dropped");
                        e.stopPropagation()
                    });
                    element.on("mouseout", function(e) {
                        element.removeClass("picture-dropped");
                        e.stopPropagation()
                    });

                    var $inputHidden = $("<input type='hidden' name='" + Options.InputOfImageDirectory + "' id='" + Options.InputOfImageDirectory + "'>");
                    $inputHidden.addClass("picture-element-image-directory");
                    element.append($inputHidden);
                    $inputHidden.attr(Options.InputOfImageDirectoryAttr);
                };
                var getExt = function(name) {
                    return name.slice(name.lastIndexOf(".") + 1);
                };
                var Setando_AjaxUpload = function(element) {
                    var post = Options.DataPost;
                    post["request"] = "upload";
                    var CustomRegex = new RegExp("^(" + Options.Extensions.join("|") + ")", "i");
                    element.uploadAjax({
                        accept: CustomRegex,
                        acceptEx: "image/*",
                        name: Options.InputOfFile,
                        method: 'POST',
                        url: Options.actionToSubmitUpload,
                        data: post,
                        onSubmit: function() {
                            ImageUploadLoading.show()
                        },
                        onComplete: function(response) {
                            var response = $.parseJSON(response);
                            ImageUploadLoading.hide();
                            ImageBoxObj = new ImageBox(response);
                                //Retorno_Requisicao(element, response.data);

                        },
                        extError: function() {
                            ImageUploadLoading("types are supported: " + (Options.Extensions.join(",")).toString())
                        }
                    });
                    element.find(":file[name='" + Options.InputOfFile + "']").mouseenter(function() {
                        element.addClass("TuyoshiImageUpload_div")
                    }).mouseout(function() {
                        element.removeClass("TuyoshiImageUpload_div")
                    })
                };
                
                var ImageBox = function(response) {
                     if(!response){
                        response = {
                            'errno' : 2,
                            'errmsg': '系统错误' 
                        };
                    }
                    this.response = response;
                    this.dialog = $('<div class="g-core-image-corp-container"></div>');
                    this.imageAside = $('<div class="image-aside"></div>');
                    this.infoAside = $('<div class="info-aside"></div>');
                    this.show();
                    
                }
                
                ImageBox.prototype = {
                    show: function() {
                        this.dialog.append(this.imageAside,this.infoAside);
                        $('body').append(this.dialog);
                        this.outputConfigInfo();
                        this._initButtons();
                        if(Options.enableCrop){
                            this._initCropBox();
                        }else{
                            this.initPic();    
                        }
                        
                        this._bind();
                    },
                    
                    hide: function() {
                        this.dialog.remove();
                    },
                    
                    initPic: function($container) {
                        $imageSrc = this.response.data.src;
                        this.pic = $('<img src="' + $imageSrc + '"/>');
                        var H = $(window).height() - 80;
                        var W = $(window).width() - 380;
                        var imageWidth  = this.response.data.width;
                        var imageHeight  = this.response.data.height;
                        if(!$container){
                            if( imageHeight > H){
                                this.pic.css('height',H);
                            }else{
                                this.pic.css('margin-top',(H-imageHeight)/2);
                            } 
                        }else{
                            if(imageWidth > W){
                                $container.css('width', W);
                                Options.cropSize = imageWidth / W;
                            }else{
                                $container.css({
                                    'width':imageWidth,
                                    'margin-left': (W - imageWidth)/2
                                });
                            }
                            if( imageHeight > H){
                                $container.css('height',H);
                                this.pic.css('height',H);
                                $container.css({
                                    'width': H/imageHeight*imageWidth,
                                    'margin-left':(W - H/imageHeight*imageWidth)/2
                                    
                                });
                                Options.cropSize = imageHeight / H;
                                
                            }else{
                                 $container.css({
                                    'margin-top': (H-imageHeight)/2,
                                    'height': imageHeight  
                                 });
                            }
                            
                            
                             var rationW = Options.cropRatio.split(':')[0],
                             rationH = Options.cropRatio.split(':')[1];
                            if(rationH>rationW){
                                
                                
                            }
                        }
                        
                        if(!$container){
                           this.imageAside.append(this.pic);
                        }else{
                            $container.append(this.pic);  
                        }
                        
                    },
                    
                    _bind:function() {
                        var me = this;
                        this.btnUpload.on('click', function(e){
                            if(Options.enableCrop){
                                return me.doCropEvent(e);
                            }
                            if(Options.uploadedCallback){
                                Options.uploadedCallback(me.response);
                                me.hide();
                            }
                        });
                        this.btnCancel.on('click',function(){
                            me.dialog.remove();
                        });
                    },
                    
                    _initButtons: function() {
                        this.btnUpload = $('<button type="button" class="btn btn-upload">确定</button>');
                        if(Options.enableCrop){
                            this.btnUpload.text('确定裁剪');
                        }
                        if(this.response.errno){
                            this.btnUpload.attr('disabled',true);  
                        }
                        this.btnCancel = $('<button type="button" class="btn btn-cancel">取消</button>'); 
                        var $btnGroup = $('<p class="btn-groups"></p>');
                        $btnGroup.append(this.btnUpload,this.btnCancel);
                        this.infoAside.append($btnGroup);
                        
                    },
                    
                    outputConfigInfo: function() {
                        //this.setNotice(this.response);
                        if(Options.enableCrop){
                            $title = $('<h4 class="task-name">图片裁剪</h4>'); 
                        }else{
                            $title = $('<h4 class="task-name">图片上传</h4>');
                        }
                        this.infoAside.append($title);
                        if(Options.enableCrop){
                           this.infoAside.append('<p class="corp-info">裁剪比例: ' + Options.cropRatio + '</p>');
                           this.showThumbImage(); 
                        }
                        if(!Options.enableCrop){
                           this._outputImageDetails();
                        }
     
                    },
                    setNotice: function(result) {
                        this.notice = $('<div class="notice-info">'+ result.errmsg +'</div>')
                        if(!this.infoAside.find('notice-info').length){
                            this.infoAside.prepend(this.notice);
                            
                        }else{
                            this.notice.text(result.errmsg);
                        }
                        if(this.response.errno){
                            this.notice.show;
                        }
                        if(this.response.errno == 2){
                            this.infoAside.find('.notice-info').addClass('errro');
                        }    
                    },
                    _outputImageDetails: function() {
                        var $table = $('<table class="image-details"></table>');
                        var htmlStr = '<tr><td>图片名称</td><td>' + this.response.data.name + '</td></tr>';
                        htmlStr += '<tr><td>图片宽度</td><td>' + this.response.data.width + '</td></tr>'; 
                        htmlStr += '<tr><td>图片高度</td><td>' + this.response.data.height + '</td></tr>'; 
                        $table.html(htmlStr);
                        var $configInfo = $('<div class="config-info"></div>');
                        $configInfo.append($table);
                        this.infoAside.append($configInfo);
                    },
                    
                    showThumbImage: function() {
                        this.thumbImage = $('<img src="' + this.response.data.src + '"/>');
                        var $imageCorpPreview = $('<div class="image-corp-preview"></div>');
                        var rationW = Options.cropRatio.split(':')[0],
                            ratioH = Options.cropRatio.split(':')[1];
                        
                        $imageCorpPreview.append(this.thumbImage);
                        this.infoAside.append($imageCorpPreview);
                        if(rationW < ratioH){
                            $imageCorpPreview.css('height',$imageCorpPreview.width());
                            $imageCorpPreview.css('width',$imageCorpPreview.height() * rationW / ratioH);
                            return; 
                        }
                        $imageCorpPreview.css('height',$imageCorpPreview.width() * ratioH / rationW);
                        
                    },
                    
                    changeThumbImage: function(x,y,w,h) {
                        var imageWidth  = this.response.data.width / Options.cropSize;
                        var imageHeight  = this.response.data.height  / Options.cropSize;
                        var containerWidth = this.thumbImage.parent().width(); 
                        var containerHeight = this.thumbImage.parent().height(); 
                        var transformRatioW = containerWidth / w;
                        var transformRatioH = containerHeight / h / Options.cropSize;
                        this.thumbImage.css({
                            "width": imageWidth * transformRatioW ,
                            "height": imageHeight * transformRatioW,
                            "margin-left": - (x  * transformRatioW),
                            "margin-top":- (y * transformRatioH ) 
                        });
                        
                        
                        
                        
                    },
                    
                    _initCropBox: function() {
                        this.imageAside.append('<div class="g-crop-image-box"><div class="g-crop-image-principal"><div></div>');
                        var $principal = this.imageAside.find('.g-crop-image-principal');
                        this.initPic($principal);
                        this.showCropBox($principal,'create');
                    },
                    // crop
                    showCropBox: function( $wrap , state) {
                        var $selectCrop = $('<div class="select-recorte"></div>');
                        $wrap.append($selectCrop);
                        var response = this.response;
                        var imageWidth  = parseInt($wrap.css('width'));
                        var imageHeight  = parseInt($wrap.css('height'));
                        var rationW = Options.cropRatio.split(':')[0],
                            ratioH = Options.cropRatio.split(':')[1];
                        var Swidth = (imageWidth / 100) * 80;
                        var Sheight = (Swidth / rationW) * ratioH;
                        $selectCrop.css({
                            "width": Swidth,
                            "height": Sheight,
                            "left": (imageWidth - Swidth) / 2,
                            "top": (imageHeight - Sheight) / 2
                        });
                        if (Sheight > imageHeight) {
                            Sheight = (imageHeight / 100) * 80;
                            Swidth = (Sheight * rationW) / ratioH;
                            $selectCrop.css({
                                "width": Swidth,
                                "height": Sheight,
                                "left": (imageWidth- Swidth) / 2,
                                "top": (imageHeight - Sheight) / 2
                            });                                                                            
                        };
                        if (state == "create") {                            
                          
                            var me = this;
                            me.changeThumbImage(parseInt($selectCrop.css('left')),parseInt($selectCrop.css('top')),$selectCrop.width(),$selectCrop.height());
                            $selectCrop.draggable({
                                containment: "parent",
                                drag: function(e) {
                                    var ui = $(e.target);
                                    var x = ui.css('left');
                                    var y = ui.css('top');
                                    var w = ui.width();
                                    var h = ui.height();
                                    me.changeThumbImage(parseInt(x),parseInt(y),w,h);
                                 }
                            });
                            
                            $selectCrop.resizable({
                                containment: "parent",
                                aspectRatio: Options.cropRatio,
                                minWidth: (Swidth / 100) * 10,
                                minHeight: (Sheight / 100) * 10,
                                resize: function(e) {
                                    var ui = $(e.target);
                                    var x = ui.css('left');
                                    var y = ui.css('top');
                                    var w = ui.width();
                                    var h = ui.height();
                                    me.changeThumbImage(parseInt(x),parseInt(y),w,h);
                                    
                                }
                            })
                            
                        };
                        
                        
                    },
                    
                    doCropEvent: function(e) {
                        var thisBtn = $(e.target);
                        thisBtn.attr("disabled", "disabled");
                        ImageUploadLoading.show('裁剪中...',true);
                        var $selectCrop = this.dialog.find('.select-recorte');
                        var data = this.response.data;
                        data["request"] = "crop";
                        data["toCropImgX"] = parseInt($selectCrop.css('left'));
                        data["toCropImgY"] = parseInt($selectCrop.css('top'));
                        data["toCropImgW"] = $selectCrop.width() * Options.cropSize;
                        data["toCropImgH"] = $selectCrop.height() * Options.cropSize;
                        data["currentFileName"] = data['src'];
                        data['fileType'] = this.response.data.type;
                        data['fileHash'] = this.response.data.hash;
                        var me = this;
                        $.post(Options.actionToSubmitCrop, data, function(result) {
                            thisBtn.removeAttr("disabled");
                            if(!result.errno){
                                ImageUploadLoading.show('裁剪成功');
                                me.hide();
                                Options.uploadedCallback(result.data);
                                
                            }else{
                                this.setNotice(result);
                            }
                            
                        }, "JSON");
                    },
                };
                
              
                
                $elemenTo = $(this);
                initUpload($elemenTo);
                Setando_AjaxUpload($elemenTo);
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
            })
        }
    };
    $.fn.PictureCut = function(MetodoOuOptions) {
        if (window.jQuery.ui === undefined) alert("Could not instantiate the PictureCut is missing jquery.ui");
        else {
            if (methods[MetodoOuOptions]) return methods[MetodoOuOptions].apply(this, Array.prototype.slice.call(arguments, 1));
            else if (typeof MetodoOuOptions === 'object' || !MetodoOuOptions) return methods.init.apply(this, arguments)
        }
    }
})(jQuery);