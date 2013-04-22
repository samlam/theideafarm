/*example
    var p = new PopupPanel({
        el: $('div#pp')
    });
    p.render(imgUrl, title, details, postId, 'S1');
*/

define([
    'text!modules/popupPanel/popupPanel.html',
    'css!modules/popupPanel/popupPanelS1.css', //desktop mode
    'css!modules/popupPanel/popupPanelS2.css', //desktop wide mode
    'css!modules/popupPanel/popupPanelS2.css',  //mobile mode
    'css!syntaxhighlighter/css/shCore.css',
//'css!syntaxhighlighter/css/shCoreDefault.css',
    'css!syntaxhighlighter/css/shThemeDefault.css',
    'css!wiky.css',
    'js!wiky.js',
//'js!syntaxhighlighter/js/shCore.js',
//'js!syntaxhighlighter/js/shAutoloader.js',
    'js!syntaxhighlighter/js/shBrushPlain.js',
    'js!syntaxhighlighter/js/shBrushJScript.js',
    'js!syntaxhighlighter/js/shBrushCss.js'
    ],
    function (html, cssS1, cssS2, cssS3) {
        var PopupPanel = Backbone.View.extend({
            el: $('div#pp'),
            template: html,
            css: cssS1,
            imgOrientation: 0, //0 undefined, 1- portrait, 2- landscape
            popupDetailsExpandEvent: popupDetailsExpandEvent,
            hiddenCallback: null,
            currentStyle: 'S1',
            bind: function (selector, event, callback) {
                var $doc = $(document);
                $doc.on(event, function (e) {
                    if (e.target === $(selector)[0]) {
                        callback(e.target);
                    }
                });
            },
            /*
            bind: function (selector, event, callback) {
            var self = this;
            $(self.el).find(selector).bind(event, callback);
            }*/
            initialize: function () {
                var self = this;
                $(document).keyup(function (e) {
                    if (e.keyCode == 27) {
                        self.hide();
                    }
                });
                /*
                SyntaxHighlighter.autoloader(
                'js jscript javascript  /scripts/syntaxhighlighter/js/shBrushJScript.js',
                'css                    /scripts/syntaxhighlighter/js/shBrushCss.js'
                );*/
            },
            render: function (imgUrl, title, details, postId, style, userId, callback) {
                var self = this,
                    t = null,
                    tags = [],
                    tData = {
                        postId: postId,
                        title: title,
                        imgUrl: imgUrl,
                        details: details,
                        userId : userId
                    };

                t = _.template(self.template, tData);
                $(this.el).html(t);
                self.currentStyle = style;
                //$('div#ppDetailsViewer div#inner').html(wiky.process(details));
                self.centerPopup();
                self.applyCss(self.currentStyle);
                SyntaxHighlighter.highlight();
                self.show();
                if (callback) callback();
            },
            show: function () {
                var b = $("#popupPanelBackdrop");
                b.css('display', 'block');
                b.css('opacity', 1);
                $('body').css('overflow', 'hidden');
            },
            hide: function () {
                var b = $("#popupPanelBackdrop");
                b.css('opacity', 0);
                setTimeout(function () {
                    b.css('display', 'none');
                }, 500);

                $('body').css('overflow', 'scroll');
                if (this.hiddenCallback) this.hiddenCallback();
            },
            populateTags: function (details) {
                var self = this;
                tags = self.findTags(details);
                if (!tags || tags.length == 0) return;
                var objs = []
                tags.forEach(function (element, index, array) {
                    var v = element.trim().substring(1);
                    objs.push({
                        label: v,
                        value: v
                    });
                });
                $('#ppTag').tagit();
                $('#ppTag').tagit("fill", objs);
            },
            getTagsFromDetails: function () {
                var self = this;
                var ppContentDetails = $(self.el).find('div#ppBody div.content div.details textarea[name="details"]');
                var buff = self.findTags(ppContentDetails.val());
                if (!buff) return null;
                var ret = []
                buff.forEach(function (element, index, array) {
                    ret.push(element.trim().substring(1));
                })

                return ret.join(','); //returns as a string, obj array doesn't work
            },
            centerPopup: function () { //imgSrc, title, details
                ///request data for centering
                var self = this;
                var windowWidth = document.documentElement.clientWidth,
                    windowHeight = document.documentElement.clientHeight,
                    content = $(self.el);
                var popupWidth = ((windowWidth - 100) < 740) ? windowWidth - 100 : 740; //$("#popupPanel").width();
                var ppPanel = content.find("#popupPanel"),
                    ppPanelBackdrop = content.find('#popupPanelBackdrop'),
                    ppImg = content.find("img#ppImg"),
                    ppContent = content.find('div#ppBody div.content'),
                    ppContentDetails = content.find('div#ppBody div.content div.details textarea[name="details"]'),
                    ppContentDetailsViewer = content.find('div#ppDetailsViewer'),
                    ppBg = content.find('#ppBg'),
                    ppPic = content.find('div#ppBody div.pic'),
                    ppBody = content.find('div#ppBody'),
                    inner = content.find('div#inner');

                //inner.html(inner.text().replace(/(\r\n|\n|\r)/g, "<br />"));
                var wikiContent = wiky.process(document.htmlEncode(ppContentDetails.val()));
                inner.html(wikiContent);
                ppPanelBackdrop.click(function (e) {
                    if ($(e.target).is("#popupPanelBackdrop")) {
                        self.hide();
                    }
                });

                ppPanel.width(popupWidth);

                //HAVE TO GET THE NAME HERE
                //$('div#popupBody h1').text();
                ppContentDetailsViewer.bind('click', function (e) {
                    switch (e.target.tagName) {
                        case "A":
                        case "IMG":
                        case "EMBED":
                            return;
                    }
                    ppContentDetailsViewer.hide();
                    ppContentDetails.show();
                    ppContentDetails.focus();
                });
                self.bind(ppContentDetails.selector, self.popupDetailsExpandEvent, function () {
                    self.resizePopup(ppImg, null, ppContent, ppBg, ppPic, ppBody);
                });
                /*
                ppContentDetails.bind(self.popupDetailsExpandEvent, function () {
                    self.resizePopup(ppImg, null, ppContent, ppBg, ppPic, ppBody);
                });*/

                ppImg.load(function () {
                    self.resizePopup(ppImg, null, ppContent, ppBg, ppPic, ppBody);
                });
                if ($("#ppImg").attr("src") == '') {
                    $("#ppImg").attr("src", "http://cdn-img.easyicon.cn/png/282/28286.gif");
                }

                self.populateTags(ppContentDetails.val());

                ppContentDetails.hide();
                ppContentDetailsViewer.show();

                //var p = $(document).scrollTop() + 20;
                //centering
                ppPanel.css({
                    "left": windowWidth / 2 - popupWidth / 2
                });

            },
            resizePopup: function (ppImg, ppControl, ppContent, ppBg, ppPic, ppBody) {
                var pHeight = (ppImg.height() > ppContent.height()) ? ppImg.height() : ppContent.height();
                ppBg.height(ppBody.height());
                //ppPic.height(pHeight);
                if (ppImg.width() < ppImg.height()) {
                    if (ppImg.height() >= pHeight) {
                        ppPic.css('border-bottom-left-radius', '9px');
                        ppImg.css('border-bottom-left-radius', '9px');
                    }
                    else {
                        ppPic.css('border-bottom-left-radius', '9px');
                        ppImg.css('border-bottom-left-radius', '0px');
                    }
                }
            },
            applyCss: function (style) {
                var self = this,
                    cssRuleList = cssS1;
                var c = $(self.el),
                    cssSelector,
                    cssName,
                    cssValue;

                switch (style) {
                    case 'S1': //desktop mode
                        cssRuleList = (self.imgOrientation == 1) ? cssS1 : cssS2;
                        break;
                    case 'S2':
                        cssRuleList = cssS2;
                        break;
                    case 'S3': //mobile
                        cssRuleList = cssS3;
                        break;
                    default:
                        cssRuleList = cssS1;
                }

                for (var i = 0; i < cssRuleList.cssRules.length; i++) {
                    cssSelector = cssRuleList.cssRules[i].selectorText;
                    var items = cssRuleList.cssRules[i].style.cssText.split(';');
                    for (var j = 0; j < items.length; j++) {
                        var kv = items[j].split(':');
                        cssName = kv[0];
                        cssValue = kv[1];
                        if (cssName.length < 1) continue;
                        c.find(cssSelector).css(cssName.trim(), cssValue.trim());
                    }
                }
            },
            findTags: function (content) {
                var words = content.match(/^@[\w-]+| @[\w-]+/gim);
                return words;
            }
        });
        return PopupPanel;
    }
);
