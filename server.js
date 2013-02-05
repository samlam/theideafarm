"use strict";
/**
 * Module dependencies.
 */
var com = require('./common.js');
var Express = require('express')
    , routes = require('./routes')
    , util = require('util')
    , http = require('http');

//var app = module.exports = express.createServer();  /// before express 3
var app = new Express();
var server = http.createServer(app);

var setHeaders = function (req, res, next) {
    
    res.header("X-Powered-By", "nodejs");
    // if ajax set access control
    //if (req.xhr) { 
    //res.header("Access-Control-Allow-Origin",'http://owa.samlam.com,http://owa.samlam.com:8001,http://owa.samlam.com:8000,http://w2k8dev1:8001,http://192.168.0.143:8001'); 
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("X-UA-Compatible", "IE=edge,chrome=1");
    //}
    return next();
}

// Configuration
app.configure(function () {
    app.use(setHeaders);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(Express.compress());
    app.use(Express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));
    app.use(Express.methodOverride());
    app.use(app.router);
    app.use(Express.static(__dirname + '/public'));
    app.use('/scripts', Express.static(__dirname + '/scripts'));
});

app.configure('development', function(){
    app.use(Express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(Express.errorHandler());
});

// Routes
///upload example
app.get('/upload', routes.upload);
app.get('/upload2', routes.upload2);
app.post('/upload', function (req, res, next) {
    console.log(req.body);
    console.log(req.files);
    //res.header('Content-Type', 'application/json');
    //return next();
    res.send(200);
});

///default landing page
//app.get('/', routes.index);
app.get('/', routes.v2);

//app.listen(process.env.port || 8000);   /// before express 3
server.listen(process.env.PORT || global.APPPORT);

process.on('uncaughtException', function (e) {
    var msg = util.inspect(e, 5);
    console.log(msg);
});

console.log('physical path :' + __dirname);
console.log("Express server listening on port %d in %s mode", server.address().port , app.settings.env);



