define([
    'text!modules/quickZoom/quickZoom.html',
    'css!modules/quickZoom/quickZoom.css'],
    function (html, css) {
        var QuickZoom = Backbone.View.extend({
            el: $('body'),
            quickZoom: null,
            initialize: function () {
                this.render();
            },
            render: function () {
                var self = this;
                $(self.el).append(html);
                self.quickZoom = $(self.el).find('#quickZoom');
                //self.initQuickZoom(); call this method when picture class are loaded
            },
            bind: function (selector, event, callback) {
                var $doc = $(document);
                $doc.on(event, function (e) {
                    if (e.target === $(selector)[0]) {
                        callback(e);
                    }
                });
            },
            initQuickZoom: function () {
                var self = this,
                    pic = $('img.picture'),
                    $qz = $(self.quickZoom);
                var $qzImg = $qz.find('img');
                $qzImg.data('loaded', false);
                $qzImg.data('rendered', false);
                $qz.data('ignoreMousemove', false);

                $(document).keydown(function (e) {
                    var key = e.keyCode;

                    if (!e.shiftKey) return;
                    if (key != 38 && key != 40 && key != 33 && key != 34) return;
                    var $qz = $('#quickZoom');
                    var cTop = $qz.offset().top;
                    switch (key) {
                        case 38: //up
                            $qz.offset({ top: cTop - 50 });
                            break;
                        case 40: //down
                            $qz.offset({ top: cTop + 50 });
                            break;
                        case 33: //pageup
                            $qz.offset({ top: cTop - 400 });
                            break;
                        case 34: //pagedown
                            $qz.offset({ top: cTop + 400 });
                            break;
                    }
                    $qz.data('ignoreMousemove', true);
                });
                pic.on('mouseenter', function (e) {
                    var $spinner = $('div#quickZoom section figure.spinner');
                    $spinner.show();
                });
                pic.on('mousemove', function (e) {
                    var brickImg = e.target;
                    var src = $(brickImg).data('src');
                    if (QuickZoom.prototype.currentImgSrc == src) {
                        if (QuickZoom.prototype.refreshTrigger == 0) {
                            QuickZoom.prototype.refreshTrigger = setInterval(function () {

                                QuickZoom.prototype.activateZoom(brickImg, src, e.pageX, e.pageY, e.clientX, e.clientY);
                                
                            }, 1000);
                        }
                        if (QuickZoom.prototype.delayTimer == 0){
                            clearInterval(QuickZoom.prototype.refreshTrigger); QuickZoom.prototype.refreshTrigger = 0;
                        }
                        
                        
                        QuickZoom.prototype.activateZoom(brickImg, src, e.pageX, e.pageY, e.clientX, e.clientY);
                    }
                    else {
                        if (QuickZoom.prototype.refreshTrigger > 0) {
                            clearInterval(QuickZoom.prototype.refreshTrigger);
                            QuickZoom.prototype.refreshTrigger = 0;
                        }
                        QuickZoom.prototype.currentImgSrc = src;
                        QuickZoom.prototype.delayTimer = setTimeout(function () {
                            QuickZoom.prototype.activateZoom(brickImg, src, e.pageX, e.pageY, e.clientX, e.clientY);
                            clearTimeout(QuickZoom.prototype.delayTimer);
                            QuickZoom.prototype.delayTimer = 0;
                        }, 1000);
                    }

                });
                pic.on('mouseleave', (function (e) {
                    if (QuickZoom.prototype.delayTimer) {
                        clearTimeout(QuickZoom.prototype.delayTimer);
                        QuickZoom.prototype.delayTimer = 0;
                    }
                    if (QuickZoom.prototype.refreshTrigger > 0) {
                        clearInterval(QuickZoom.prototype.refreshTrigger);
                        QuickZoom.prototype.refreshTrigger = 0;
                    }
                    var brickImg = e.target,
                        qz = $('#quickZoom'),
                        qzImg = $('#quickZoom img'),
                        $spinner = $('div#quickZoom section figure.spinner');
                    $spinner.show();
                    qz.css('display', 'none');
                    qzImg.css('width', 'auto');
                    qzImg.attr('src', null);
                    qzImg.data('loaded', false);
                    qz.data('ignoreMousemove', false);
                }));
            }
        });
        QuickZoom.prototype.refreshTrigger = 0;
        QuickZoom.prototype.delayTimer = 0;
        QuickZoom.prototype.currentImgSrc = '';
        QuickZoom.prototype.activateZoom = function (brickImg, src, pageX, pageY, clientX, clientY) {
            var qz = $('#quickZoom'),
                qzImg = $('#quickZoom img'),
                x = pageX,
                y = pageY,
                winWidth = $(window).width(),
                winHeight = $(window).height(),
                left = 0,
                right = 0,
                top = null,
                qzImgWidth = 0,
                qzImgHeight = 0;


            ///user pressed the shift/ctrl key; let's ignore the mouse movement
            if (qz.data('ignoreMousemove')) return;

            ///load the image 
            if (qzImg.attr('src') != src) {
                qzImg.attr('src', src).on('load', function (e) {
                    var i = $(e.target);
                    i.data('loaded', true);
                    i.data('rendered', false);
                    qz.css('display', 'block');
                });
            }
            //position and resize to fit the window
            if (qzImg.data('loaded')) {
                var midx = (winWidth * .5),
                    winTop = (pageY - clientY),
                anchor = { x: 0, y: 0, left: 0, right: 0, top: 0, bottom: 0 };
                var isCursorOnLeft = (x < midx) ? true : false;
                qzImgWidth = qzImg.width();

                //evaluate horizontal position
                if (isCursorOnLeft) {
                    anchor.x = x + 40;
                    anchor.y = y - 15;
                    left = anchor.x;
                    right = anchor.x + qzImgWidth;

                    if (right > winWidth) right = winWidth - 10;
                } else {
                    anchor.x = x - 40;
                    anchor.y = y - 15;
                    left = anchor.x - qzImgWidth;
                    right = anchor.x;

                    if (left < 0) left = 0;
                }

                qzImg.css('width', right - left);

                //evaluate vertical position
                qzImgHeight = qzImg.height();
                top = anchor.y - qzImgHeight * .5;

                if (qzImgHeight > winHeight) {
                    top = winTop;
                }
                if (top < winTop || top < 0) top = winTop;

                var $spinner = $('div#quickZoom section figure.spinner');
                $spinner.hide();
            } else {
                left = x + 80;
                top = y - 40;
            }
            qz.offset({
                top: top,
                left: left
            });
        }
        return QuickZoom;
    }
);


