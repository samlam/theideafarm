curl({
    baseUrl:'scripts'
});
var apiBasePath = '',
    isMobile = false,
    userId = '';
var fileBasePath = '',
    isLoading = false,
    popupPostId = '',
    popupTitle = null,
    popupDetails = null,
    rolloverSound = null,
    popupDetailsExpandEvent = 'textareaExpandTriggered',
    reloadMasonryEvent = 'reloadMasonryEvent',
    masonryHelper = null,
    reloadPosts = null,
    popupPanelHelper = null,
    growlHelper = null,
    $container = null,
    quickZoomHelper = null,
    youtubePanelHelper = null,
    isRunningGetNext = 0, //check the scroll event
    isRunningReload = 0; //workaround

//need to protect masonry
document.init = function (options) {
    apiBasePath = options.apiBasePath;
    isMobile = options.isMobile;
    userId = options.userId;
    fileBasePath = apiBasePath + '/file/';

    $container = $('#column');
    curl(['modules/growl/growl'], function (Growl) {
        growlHelper = new Growl({
            el: $('div#growlHolder')
        });
        document.notify('Welcome', 'to ideafarm');
    });
    curl(['modules/popupPanel/popupPanel']).then(function (PopupPanel) {
        popupPanelHelper = new PopupPanel();
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 30) {
            if (isRunningGetNext > 0) return;
            isRunningGetNext = 1;
            document.getPosts(masonryHelper.brickCount, function () {
                document.getQuickZoom();
                isRunningGetNext = setTimeout(function () { 
                    clearTimeout(isRunningGetNext); 
                    $(document).trigger(reloadMasonryEvent); 
                    isRunningGetNext = 0 ; 
                },1000);
            }, function () {
                isRunningGetNext = 0;
            });

        }
    });

    document.htmlEncode = function (value) {
        if (value) {
            return jQuery('<div />').text(value).html();
        } else {
            return '';
        }
    }

    document.htmlDecode = function (value) {
        if (value) {
            return $('<div />').html(value).text();
        } else {
            return '';
        }
    }

    document.pause = function (milliseconds) {
        var start = new Date().getTime();
        while (true) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    document.getMasonry = function (masonryFunc) {
        curl(['modules/masonry/masonry'])
        .then(function (Masonry) {
            if (!masonryHelper) {
                var width = $(window).width();
                masonryHelper = new Masonry();
                masonryHelper.batchSize = Math.round(width / 240) * 3;
                //eventlistener when reload is needed
                $(document).on(reloadMasonryEvent, function (e) {
                    masonryHelper.reload();
                });
            }
            if (masonryFunc) masonryFunc(masonryHelper);
        })
    }

    document.getYoutubePanel = function (youtubeFunc, next) {
        curl(['modules/youtubePanel/youtubePanel'])
        .then(function (YoutubePanel) {
            if (!youtubePanelHelper) {
                youtubePanelHelper = new YoutubePanel();
            }
            if (youtubeFunc) youtubeFunc(youtubePanelHelper);
        })
        .then(function () {
            if (next) next();
        });
        return youtubePanelHelper;
    }

    document.getQuickZoom = function (quickZoomFunc, next) {
        curl(['modules/quickZoom/quickZoom'], function (QuickZoom) {
            if (!quickZoomHelper) {
                quickZoomHelper = new QuickZoom({
                    el: $('div#quickZoomHolder')
                });
            }
            quickZoomHelper.initQuickZoom();
            if (quickZoomFunc) quickZoomFunc(quickZoomHelper);
        })
        .then(function () {
            if (next) next();
        });
        return quickZoomHelper;
    }

    document.getPosts = function (lastPostion, callback, endofDataCallback) {
        var bSize = 8;
        document.getMasonry(function (m) {
            bSize = m.batchSize;
            $.ajax({
                url: apiBasePath + "/postList/50b198cfaee84a500f000001/" + lastPostion + "?batchSize=" + bSize,
                type: 'GET',
                crossDomain: true,
                error: function (xhr, status, err) {
                    document.notify('get post', 'my apology, the site supports chrome/firefox/safari only - ' + err, 3000);
                    //delay by a second and retry
                    masonryHelper.brickCount = lastPostion;
                    var delay = (lastPostion == 0) ? 2000 : 200;
                    setTimeout(document.getPostWithJsonp, delay);
                },
                success: function (data) {
                    if (data.length === 0) {
                        if (isRunningReload == 0) { //workaround 
                            $(document).trigger(reloadMasonryEvent);
                            isRunningReload = setTimeout(function () { clearTimeout(isRunningReload); isRunningReload = 0 }, 2000);
                        }
                        document.notify('end of page', 'no more posts available');
                        if (endofDataCallback) endofDataCallback();
                    } else {
                        document.loadBricks(data, callback);
                        masonryHelper.brickCount = lastPostion + masonryHelper.batchSize;
                    }
                },
                dataType: "json",
                cache: false
            });
        });

    }

    document.loadBricks = function (data, callback) {
        isLoading = true;
        document.getMasonry(function () {
            var bricks = [];
            $.each(data, function (key, value) {
                var c = masonryHelper.render(fileBasePath + value.ImageFileId, value.Message, value.Title, value._id, null, null, rolloverSound);
                bricks.push(c[0]);
            });
            masonryHelper.load(bricks, function (elementHolder) {
                document.getYoutubePanel(function (youtubePanel) {
                    youtubePanel.render(elementHolder);
                }, callback);
            });
        });
    }

    document.showPopup = function (imgUrl, title, details, thumbPic, postId) {
        var style = (isMobile) ? 'S3' : 'S1';
        var orientation = (thumbPic.width() > thumbPic.height()) ? 2 : 1;
        popupPostId = postId;
        popupPanelHelper.hiddenCallback = function () {
            $container.css('-webkit-filter', 'blur(0px)');
            $container.css('-moz-filter', 'blur(0px)');
            $container.css('-ms-filter', 'blur(0px)');
        }
        popupPanelHelper.imgOrientation = orientation;
        popupPanelHelper.render(imgUrl, title, details, postId, style, function () {

        });

        popupTitle = $('div#ppBody div.content h2 input[name="title"]');
        popupDetails = $('div#ppBody div.content div.details textarea[name="details"]');
        popupDetails.textareaExpander({ expandEventName: popupDetailsExpandEvent, animate: false });
        popupPanelHelper.bind(popupDetails.selector, 'focusout', function (target) {
            document.toSavePost();
            popupPanelHelper.centerPopup();
            popupPanelHelper.applyCss(popupPanelHelper.currentStyle);
            SyntaxHighlighter.highlight();
            youtubePanelHelper.render();
            popupPanelHelper.show();
        });
        popupPanelHelper.bind(popupTitle.selector, 'focusout', function (target) {
            document.toSavePost();
            youtubePanelHelper.render();
        });
        youtubePanelHelper.render();
        //$container.css('-webkit-filter','blur(4px)');
        //$container.css('-moz-filter','blur(4px)');
        //$container.css('-ms-filter','blur(4px)');
    };

    document.notify = function (title, message, interval) {
        growlHelper.render(title, message, interval);
        //rolloverSound.play();
    };

    document.savePost = function (postId, title, details, imageFileId, tags, sessionId, callback) {
        var data = {
            title: title,
            message: details,
            imageFileId: imageFileId,
            tagList: tags,
            sessionId: sessionId
        };
        $.ajax({
            type: 'POST',
            url: apiBasePath + '/postUpdate/' + postId,
            crossDomain: true,
            data: data,
            dataType: 'json',
            success: function (responseData, textStatus, jqXhr) {
                callback(null, responseData.message);
            },
            error: function (responseData, textStatus, errorThrown) {
                callback(errorThrown);
            }
        });
        masonryHelper.update(postId, title, details);
    }

    document.toSavePost = function () {
        var tags = popupPanelHelper.getTagsFromDetails();
        document.savePost(popupPostId, popupTitle.val(), popupDetails.val(), null, tags, null, function (err, status) {
            if (err) {
                document.notify('problem occured', err);
            }
            else {
                document.getMasonry(function (m) { m.reload(); })
                document.notify('post saved', ' ', 3000);
            }
        });

    };

    document.getPostWithJsonp = function () {
        var postList = document.createElement('script'),
            bCount = 0,
            bSize = 0;
        document.getMasonry(function (m) {
            bCount = m.brickCount;
            bSize = m.batchSize;
        })
        postList.type = 'text/javascript';
        postList.src = apiBasePath + '/postList/50b198cfaee84a500f000001/' + bCount + '?batchSize=' + bSize + '&callback=reloadPosts';
        document.head.appendChild(postList);
        document.head.removeChild(postList);
    };

    reloadPosts = function (data) {
        isLoading = true;
        document.getMasonry(function (masonry) {
            document.loadBricks(data, function () {
                document.getQuickZoom();
                $(document).trigger(reloadMasonryEvent);
            });
        });
    };
};
$(document).ready(function () {
    curl(['modules/mobileViewPort']).then(function (viewPort) {
        viewPort.isMobile = isMobile;
        viewPort.set();
    });
    //rolloverSound = new buzz.sound("/media/rollover",{formats:["ogg","mp3"],preload:true});
    //rolloverSound.setVolume(50);//50%
    //rolloverSound.setSpeed(3);  //300% faster
    document.getMasonry(function (m) {
        isRunningGetNext = 1;
        document.getPosts(0, function () {
            document.getQuickZoom();
            isRunningGetNext = 0;
            setTimeout(function () {
                $(document).trigger(reloadMasonryEvent);
            }, 500);
        }, function () {
            isRunningGetNext = 0;
        });
    });

    //TODO: replace with Session
    //$.support.cors = true;


});
