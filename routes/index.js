var uap = require('ua-parser'),
    com = require('../common');//.parse(navigator.userAgent);
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
        title: 'theideafarm',
        apiBasePath: global.APIBASEPATH,
        isMobile: isMobileUserAgent(req)
    });
};

exports.v2 = function (req, res) {
    //console.log('user:' +  com.util.inspect( req.session.passport.user,false,5) );
    //console.log('session:' + com.util.inspect(req.session, false, 5));
    res.render('v2', {
        title: 'theideafarm',
        apiBasePath: global.APIBASEPATH,
        isMobile: isMobileUserAgent(req),
        userId: ''
    });
};

exports.login = function (req, res){
    res.render('login',{
        title: 'theideafarm',
        apiBasePath: global.APIBASEPATH,
        isMobile: isMobileUserAgent(req)
    })
}

exports.upload = function (req, res) {
    res.render('upload', { title: 'theideaFarm - upload' });
};

exports.upload2 = function (req, res) {
    res.render('upload2', {
        title: 'theideafarm',
        apiBasePath: global.APIBASEPATH,
        isMobile: isMobileUserAgent(req)
    });
}

