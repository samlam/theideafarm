'use strict';
/* 
    Global configurations
*/

global.APIHOST = 'api.samlam.com';
global.APISERVER = 'http://' + global.APIHOST;
global.APIPORT = 89;
global.APIBASEPATH = global.APISERVER + ':' + global.APIPORT;
global.APPPORT = process.env.PORT || 80;
global.HOSTURL = 'lab.samlam.com';

/*
    Commmon object for imported modules and configurations
*/
var common = {
    util : require('util'),         //from node
    events : require('events'),     //from node
    fs : require('fs'),             //from node
    http : require('http'),         //from node
    sessionSecret:'donttell',
    googleApi : {
        clientId:'[GOOGLEAPI_CLIENTID]',
        clientSecret:'[CLIENT_SECRET]',
        accessReturnUrl: global.HOSTURL + '/auth/google/callback'
    },
    getSessionUserId: function(req){
        return (req.session.passport.user)? req.session.passport.user.UserName: "";
    },
    getSessionUserObjectId: function(req){
        return (req.session.passport.user)? req.session.passport.user._id:"";
    }
};

module.exports = common;
