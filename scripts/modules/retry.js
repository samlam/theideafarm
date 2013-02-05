define([],
    function () {
        var defaults = {
            timeout: 15000,
            interval: 100,
            func: null,
            onSuccess: function () { },
            onFailure: function () { }
        }
        var extend = function (destination, source) {
            for (var property in source)
                destination[property] = source[property];
            return destination;
        };

        var Retry = function (options) {
            options = extend(defaults, options);
            if (options.func == null) return;
            var startTime = new Date();
            var timeoutTime = new Date();
            timeoutTime.setMilliseconds(startTime.getMilliseconds() + options.timeout);
            var timer = setInterval(function () {
                if (new Date() > timeoutTime) {
                    options.onFailure();
                    clearInterval(timer);
                }
                if (options.func) {
                    options.onSuccess();
                    clearInterval(timer);
                }
            }, options.interval);
        }
        return Retry;
    }
);
