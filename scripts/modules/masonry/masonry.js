define([
    'text!modules/masonry/masonryBox.html',
    'css!modules/masonry/masonry.css',
    'js!jquery.masonry.js',
    'js!wiky.js',
    'css!wiky.css'],
    function (rawTemplate, css) {
        var Masonry = Backbone.View.extend({
            el: $('#column'),
            template: rawTemplate,
            css: css,
            brickCount: 0,
            batchSize: 8,
            initialize: function () {
                /*var $el = $(this.el);
                $el.imagesLoaded(function () {
                $el.masonry({
                itemSelector: '.box',
                columnWidth: 0,
                isAnimated: true,
                animationOptions: {
                duration: 400
                }
                });
                });*/
            },
            render: function (urlMainImage, details, title, postId, actions, comments, soundfunc) {
                var self = this;
                var $t = $(self.template);
                var img = $t.find('.pic a img');
                var dTitle = $t.find('div.details h2');
                var d = $t.find('div.details p');
                var a = $t.find('div.actions p');

                img.attr('src', urlMainImage + '?size=240x9999');     //display the image in the brick
                img.attr('data-src', urlMainImage);
                /*img.one('load', function () {
                if(soundfunc) soundfunc.play();
                });*/
                if (title) dTitle.append(document.htmlEncode(title));
                if (details) {
                    d.append(wiky.process(document.htmlEncode(details), { excerptMode: true }));
                }
                d.attr('title', title);
                d.attr('data-details', document.htmlEncode(details));
                //a.text(actions);
                $t.attr('postId', postId);
                $t.find('.pic').bind('click', function () {
                    var p = $('div[postId="' + postId + '"]');
                    var thumbPic = p.find('img.picture'),
                        embedDetails = p.find('div.details p');
                    document.showPopup(
                        urlMainImage,
                        embedDetails.attr('title'),
                        document.htmlDecode(embedDetails.attr('data-details')),
                        thumbPic,
                        postId);
                });
                return $t;
            },
            load: function (renderedBricks, preLoadFunc, callback) {
                if (!renderedBricks || renderedBricks.length === 0) return;

                var self = this;
                var $el = $(self.el);

                $el.append(renderedBricks);
                if (preLoadFunc) preLoadFunc(renderedBricks);
                var $bricks = $(renderedBricks)

                if (self.brickCount <= self.batchSize) {
                    $bricks.css({ opacity: 0 });
                    //if this is the inital load, let's initialize the container
                    $el.imagesLoaded(function () {
                        $el.masonry({
                            itemSelector: '.box',
                            columnWidth: 0,
                            isAnimated: true,
                            animationOptions: {
                                duration: 400
                            }
                        });
                        $bricks.animate({ opacity: 1 });
                        if (callback) callback();
                    });
                } else {
                    //var $bricks = $(renderedBricks).css({ opacity: 0 });
                    $el.imagesLoaded(function (imgs) {
                        $el.masonry('appended', $bricks, true).masonry('reload');
                        //$bricks.animate({ opacity: 1 });
                        if (callback) callback();
                    });
                }
            },
            reload: function () {
                var $el = $(this.el);
                $el.masonry('reload');
            },
            applyStyle: function (content, cssRule) {
                content.find(cssRule.selectorText).append(cssRule);
            },
            update: function (postId, title, details) {
                var $brick = $('div[postId=' + postId + ']');
                var $details = $brick.find('div.details p'),
                    $title = $brick.find('div.details h2');
                var encodedDetails = document.htmlEncode(details);
                if (title) $title.html(document.htmlEncode(title));
                $details.attr('data-details', encodedDetails);
                $details.attr('title', title);
                $details.html(wiky.process(encodedDetails, { excerptMode: true }));
            }
        });
        return Masonry;
    }
);
