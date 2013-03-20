var com = require('../common'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var http = require("http");

passport.serializeUser(function(user, done){
    done(null,user);
});
passport.deserializeUser(function(obj, done){
    done(null,obj);
});

passport.use(new LocalStrategy(
    function(username, password, done){
        //this is a dummy implementation
        process.nextTick(function(){
           var u = {
                provider: "local",
                email: 'test@test.com'
           };
           console.log('returning user');
           return done(null,u);
       });
    })
);

passport.use(new GoogleStrategy({
    clientID : com.googleApi.clientId,
    clientSecret: com.googleApi.clientSecret,
    callbackURL: 'http://' + global.HOSTURL + '/auth/google/callback',
    realm: 'http://' + global.HOSTURL
  },
  function(accessToken, refreshToken, profile, done) {
        //console.log('userProfile : ' + util.inspect(profile,false,5)) ;
        console.log('accessToken : ' + com.util.inspect(accessToken, false, 5));
        console.log('refreshToken: ' + com.util.inspect(refreshToken , false, 5));
        process.nextTick(function(){
            //establish userid, which will be returned back to the session

            if (!profile) 
                return (new Error('No Google profile returned '));
            
            var email = profile.emails[0].value,
                googleId = profile.id;
            
            var options = {
                hostname: global.APIHOST,
                port: global.APIPORT,
                path: '/user/authenticate/' + encodeURIComponent(email),
                method: 'GET'
                //headers: {'Content-Type':'application/json'}
            };
            console.log(options);
            http.get( options, function(res) {
                console.log('user authentication response: ' + res);
                res.on('data', function(chunk){
                    console.log('body:' + chunk);
                });
            }).on('error', function(e) {
                console.log('user authentication error: ' + e.message);
            });
          return done(null, profile);
        });
      
    //User.findOrCreate({ openId: identifier }, function(err, user) {
    //  done(err, user);
    //});
  }
));



var SecurityManager = function () {
    if (!(this instanceof SecurityManager))
        return new SecurityManager();

    //constructor for parent
    com.events.EventEmitter.call(this);
    
    var _self = this;
    var _clog = function (message) {
        console.log(com.util.format('SecurityManager : %s', message));
    };

    SecurityManager.prototype.passport = passport;
    
    SecurityManager.prototype.authenticateUser = function (req, callback){
        var u, err;
        if(req.session.passport && req.session.passport.user){
            u = req.session.passport.user;
            console.log(u);
            req.session.googleId = u.id;
        }
        if (callback)
            return callback(err,u);
    }
    
    SecurityManager.prototype.registerUser = function (info, callback){
        var u, err;
        if (callback)
            return callback(err,u);
    }
    
    SecurityManager.prototype.passportAuthenticate = function(strategy){
        switch (strategy){
            case 'local':
                return passport.authenticate(strategy, {failureRedirect:'/login'});
                break;
            case 'google':
                return passport.authenticate(strategy, { scope: [
                    //'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email'] });
                break;
        }
    }
    
    SecurityManager.prototype.passportCallback = function(strategy){
        switch(strategy){
            case 'google':
                return passport.authenticate('google', { failureRedirect: '/login' });
                break;
        }
    }
}


com.util.inherits(SecurityManager, com.events.EventEmitter);
module.exports = SecurityManager();

