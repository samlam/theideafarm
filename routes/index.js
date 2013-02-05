var uap = require('ua-parser');//.parse(navigator.userAgent);
/*
 * GET home page.
 */

var isMobileUserAgent = function (req) {
    var agents = ["android", "ios", "mobile"];
    console.log(req.headers['user-agent']);
    var ua = uap.parse(req.headers['user-agent']),
        os = '';
    if (ua.os) os = JSON.stringify(ua.os.family).toLowerCase();
    console.log ('ua.os : ' + os );
    var found = false;
    for( var i = 0; i < agents.length; i++){
        if (os.indexOf( agents[i] ) > -1) {
            found = true;
            break;
        }
    };
    return found;
}

exports.index = function (req, res) {
    res.render('index', {
        title: 'ideaFarm',
        apiBasePath: global.APIBASEPATH,
        isMobile: isMobileUserAgent(req)
    });
};

exports.v2 = function (req, res) {
    res.render('v2', {
        title: 'theideaFarm',
        apiBasePath: global.APIBASEPATH,
        isMobile: isMobileUserAgent(req),
        userId: ''
    });
};

exports.upload = function (req, res) {
    res.render('upload', { title: 'theideaFarm - upload' });
};

exports.upload2 = function (req, res) {
    res.render('upload2', {
        title: 'theideaFarm',
        apiBasePath: global.APIBASEPATH,
        isMobile: isMobileUserAgent(req)
    });
}

