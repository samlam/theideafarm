define([
    'text!modules/growl/growl.html',
    'css!modules/growl/growl.css'],
    function (html, css) {
        var View = Backbone.View.extend({
            el: $('body'),
            template: html,
            css: css,
            msgInterval: 15000, //in ms
            msgTimer: null,
            initialize: function () {
            },
            render: function (title, message, interval) {
                var self = this,
                    t = null,
                    tData = {
                        head: title,
                        message: message
                    };
                var i = (interval) ? interval : self.msgInterval;

                t = _.template(self.template, tData);
                if (self.msgTimer) {
                    clearTimeout(self.msgTimer);
                    self.hide();
                }
                $(this.el).append(t);
                self.msgTimer = setTimeout(function () {
                    self.hide();
                }, i)
            },
            hide: function () {
                $('#growl.notifications').css('display', 'none');
            }
        });
        return View;
    }
);
