a personal blogging platform, written in node.js + express.js, is in early stage of development

##TODO
* QuickZoom delayTimer doesn't work anymore
* add <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
* trim function doesn't work in Safari

##High impact UX features
* post tagging
** mass tag during upload
** private / public tagging (private tag example : save this for son's bday, vege dinner idea)
** search by tag
* using backbone router to select specific post in popupPanel , so i can share article
* add notes on a post (by another owner)
* popupPanel seems really slow when editing (reduce event by leveraging bubbling)
** jquery dom events should bound at the highest level (document) as much as possible; this requires major rewrite
* ability to delete but it is just marked hidden with special private/public tag, called hidden
* ability to select multiple posts and apply action, such as save for favorite/ private tagging
* add paper-like box shadow to popupPanel
* comment on post
* remove gm from api
** do not run gm within restify / realtime/online process
** modify cachePlugin to add thumbnail request into queue, which is stored in mongodb 
** a separate daemon service will be used to convert images for cache
** if cache copy not found, return original image for the thumbnail
** do not add img to queue during upload
* add Scroll-To-Top panel
* play sound when notification is shown
* mobile browser - address multi-touch http://www.queness.com/post/11755/11-multi-touch-and-touch-events-javascript-libraries
* ignore certain tags when processing wiky in masonry.js

##UX features
* scroll to top
* to make css more organize: research/ use css variables - node-sass
* experiment <script defer / async /> to speed up performance
* when mouseover a brick, show the title in tooltip
* ability to search posts (details/comments/tags) with the API
* prevent right click on images / div
* user authentication 
* integrate with google g+ oauth
* IE XSS feature is disabled by default (find workaround)
* in popupPanel, click arrow icon to next post
* change the sound with a bit more bass or lower tone
* curl shadow for the popupPanel (http://cssdeck.com/labs/e52vwfwm)
* add editor for the post that uses wiki parser such as [[https://github.com/tanin47/wiky.js | wiky]]
* ability to attach video from utube
* longer term image storage with Amazon S3
* refactor popupPanel css templates to update classnames (addClass/removeClass) instead of injecting css attributes
* serving 304 on static files https://groups.google.com/forum/?fromgroups=#!topic/nodejs/ujsfiI8CKEs
* to use typewriter sound-effect when loading the bricks / masonry

##plugin/app feature
* add lumosity-like feature (neruo science base exercise) to manage/ organize the posts
* build filter effect tool for selected / uploaded pic
* Site to generate QR Code image
* free apns
* add webhooks from wordpress that new article can be posted here directly and automatically http://en.support.wordpress.com/webhooks/
* Twitter-Bootstrap framework could be used https://npmjs.org/package/twitter-bootstrap


##Backend features
* need to use Emit for the cachePlugin (in api servicemanager)
* lab.samlam.com
* double check content-length on the thumbnail
* real-time resize is not scalable, needs a way to cache at the server
* iisnode has 4mb response stream limit (fine with just node)
* android/ie/safari viewing images (fix ajax alternative with timer)
* honor header pragma: "no-cache"
* setting up new db with default AdminId '50b198cfaee84a500f000001'
* socket.io seeing comments showing up life


##Configurations/ Setup
###Web/common.js
* global.APIBASEPATH
* global.APPPORT

###Api/lib/common.js
* global.MAINDB 
* global.APPPORT 
* global.DEFAULTUSER
* global.maindb 
* adminID : new mongoose.mongo.BSONPure.ObjectID('50b198cfaee84a500f000001')

##Testcases
* screensize: http://mattkersley.com/responsive/
* add new pic post
* edit pic post
* edit code block with syntaxHighlighter 
* add large pic post
* add 50 large pic post
* popupPanel : create post with html & xml & javascript content
* popupPanel : content with only 1 line without \r\n
* quickZoom : show img after initial fresh load of the page

###browsers
* chrome
* firefox
* Safari
* IE9

###mobile browsers
iphone safari
android default
android dolphin
android chrome

##Released
* line-height in popuppanel is adjusted with the porportion of text box width
* fixed : PostList api needs to sort before the limit
* limited support with IE 9
* Infinite Scroll
* added tagging and auto tagging with @keyword
* fixed : apply proper window height on quickZoom http://stackoverflow.com/questions/504052/determining-position-of-the-browser-window-in-javascript
* fixed : click popupPanel can open image on different tab (full size)
* fixed : xml or html content in details textarea will break the app
* fixed : after updating the popupPanel, the Title element isn't updated in the masonry brick
* added lite-youtube check yt-State https://developers.google.com/youtube/2.0/reference#youtube%5Fdata%5Fapi%5Ftag%5Fyt%3Astate
* fixed : css on wiky rendering
* fixed : popupPanel - re-render the post after it is saved
* fixed : quickZoom - check if the img src is already the same; return if so
* fixed : quickZoom progress icon is interfering the mousemove event (causing the event to trigger continously)
* quickZoom should adjust the anchor position dynamically
* auto zoom the picture by mouseover with column / stream
** zoom popup effect using remooz http://digitarald.de/project/remooz/1-0/showcase/simple-caption/
** http://cssdemos.tupence.co.uk/image-popup.htm
* to give the popupPanel a sense of focus, let's try adding blur in div#column (-webkit-filter: blur(3px);)
* node.js extend: using xtend lib to extend object
* thumbnail server-side caching
* add dark gray control menu in popup panel 
* add upload main menu
* image last-modified attr could use the update date; server-side must issue 304 after checking if-modified-since or if-none-match
* gave up on canvas / Python/ cairo ; GM is much better http://aheckmann.github.com/gm/
** canvas (experiment with this)
*** Python/Cairo
*** https://github.com/LearnBoost/node-canvas/wiki/_pages
*** update %PATH% to include python exe location
*** Cairo lib (GTK) has to on C Drive or it won't find it
* Image resize - GraphicsMagick http://aheckmann.github.com/gm/
* play sound when interacting with objects
* mouseleave event needs to be fixed
* refactor popupContact css to popupPanel
* fixed - doesn't work with IE or android
* detect mobile browser
* refactor masonry with backbone
* refactor popupPanel with Backbone
* popupPanel should resize dynamically per window's with
* fixed applyCss func for firefox
* limits the scroll height when popupPanel is in focus
* growl notifications
* popupPanel supports multiple templates
* play sound in popup 
* saved error is reported with growl
* fixed: title is missing in popup after newly updated by reopen



##MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.