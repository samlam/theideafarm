define([],
    function () {
        var mobileViewPort = {
            isMobile: false,
            set: function () {
                if (!this.isMobile) return;
                var viewPort = document.createElement('meta');
                viewPort.name = 'viewport';
                viewPort.content = 'width=device-width, initial-scale=1.0';
                document.head.appendChild(viewPort);
            }
        }
        return mobileViewPort;
    }
);
