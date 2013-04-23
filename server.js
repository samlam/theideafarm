"use strict";
/**
 * Module dependencies.
 */
var com = require('./common');
var express = require('express'), 
    routes = require('./routes'),
    util = require('util'),
    http = require('http'),
    securityManager = require('./lib/securityManager');

var app = new express();
//var server = http.createServer(app);

var setHeaders = function (req, res, next) {
    
    res.header("X-Powered-By", "nodejs");
    // if ajax set access control
    //if (req.xhr) { 
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("X-UA-Compatible", "IE=edge,chrome=1");
    //}
    return next();
}

// Configuration
app.configure(function () {
    app.use(setHeaders);
    app.use(express.compress()); //needs to be high above the stack
    app.use('/scripts', express.static(__dirname + '/scripts'));
    app.use(express.static(__dirname + '/public'));
    //app.use(express.logger());  // can ignore requests above this line
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret: com.sessionSecret,
        cookie:{maxAge:60000}
    }));
    app.use(securityManager.passport.initialize());
    app.use(securityManager.passport.session());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
///upload example
app.get('/upload', routes.upload);
app.get('/upload2', function(req,res,next){
    securityManager.validateUser(req,res,routes.upload2);
});
app.post('/upload', function (req, res, next) {
    //receive files
    console.log(req.files);
    //res.header('Content-Type', 'application/json');
    //return next();
    res.send(200);
});
app.get('/login', routes.login);
app.post(
    '/auth/local', 
    securityManager.passportAuthenticate('local'),
    function(req, res){
        res.redirect('/');
    }
);

app.get(
    '/auth/google',
    securityManager.passportAuthenticate('google'),
    function(req, res){
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    }
);

app.get(
    '/auth/google/callback', 
    securityManager.passportCallback('google'),
    function(req, res) {
        securityManager.authenticateUser(req, function(err, user){
            res.redirect('/');
        });
    }
);

///default landing page
//app.get('/', routes.index);
app.get( '/', 
    function(req,res,next){
        if (!req.session.passport.user){
            res.redirect('/auth/google');
        }else{
            routes.v2(req,res);
        }
});

app.listen(process.env.PORT || 8000);   /// before express 3
//server.listen(process.env.PORT);


process.on('uncaughtException', function (e) {
    var msg = util.inspect(e, 5);
    console.log(msg);
});

//console.log('physical path :' + __dirname);
console.log("Express server listening on port %d in %s mode", process.env.PORT , app.settings.env);

