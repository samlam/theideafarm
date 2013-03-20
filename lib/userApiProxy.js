var com = require('../common');


var UserApiProxy = function () {
    if (!(this instanceof UserApiProxy))
        return new UserApiProxy();

    //constructor for parent
    com.events.EventEmitter.call(this);

    //maintain access to the postManager obj
    var _self = this;
    var _clog = function (message) {
        com.log('UserApiProxy : %s', message);
    };

    UserApiProxy.prototype.authenticateUser = function (userContext, callback ){
        var body = {};
        switch(userContext.strategy){
            case 'google':
                body.accessToken = userContext.accessToken;
                body.username = userContext.username;
                break;
            case 'local':
                break;
            default:
                throw new Error('Invalid passport strategy');
        }
        var options = {
            hostname : global.APISERVER,
            port: global.APIPORT,
            method:'POST',
            path:'/user/authenticate'
        }
        var req = com.http.request(options, function(httpRes){
            httpRes.setEncoding('utf8');
            httpRes.on('data', function(chunk){
                var ret = chunk;
                console.log('UserApiProxy authenticateUser : ' + ret);
                if (callback)
                    callback(ret);
            });
        });
        
        req.on('error', function(e){
            console.log('UserApiProxy message : ' + e.message);
        });
        
        req.write(body);
        req.end();
    }


};


com.util.inherits(UserApiProxy, com.events.EventEmitter);
module.exports = UserApiProxy();

