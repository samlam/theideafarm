define(['text!/templates/masonryBox.html', 'css!/stylesheets/popupPanel.css'],
    function (dep1, dep2) {
        var View = Backbone.View.extend({
            el: $('body'),
            template: dep1,
            css: dep2,
            bind: function (selector, event, callback) {
                var $doc = $doc(document);
                $doc.on(event, function (e) {
                    if (e.target === $(selector)[0]) {
                        callback(e.target);
                    }
                });
            },
            initialize: function () {
                this.render();
            },
            render: function () {
                var self = this;
                $(this.el).html('');
                $(this.el).append('');
                //self.css.cssRules[3].selectorText
                //self.css.cssRules[3].style.getPropertyCSSValue(self.css.cssRules[3].style.item(0)).cssText
            }
        });
        return View;
    }
);
