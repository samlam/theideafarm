var uap = require('ua-parser');//.parse(navigator.userAgent);
/*
 * GET home page.
 */

var isMobileUserAgent = function (req) {
    var agents = ["android", "ios", "mobile"];
    console.log(req.headers['user-agent']);
    var ua = uap.parse(req.headers['user-agent']),
        os = '';
    if (ua.os) os = ua.os.toLowerCase();
    var found = false;
    agents.forEach(function (e, index, array) {
        if (os.indexOf(e) > -1) {
            found = true;
            return found;
        }
    });
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

