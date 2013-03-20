'use strict';
/* 
    Global configurations
*/

global.APIHOST = 'api.samlam.com';
global.APISERVER = 'http://' + global.APIHOST;
global.APIPORT = 89;
global.APIBASEPATH = global.APISERVER + ':' + global.APIPORT;
global.APPPORT = process.env.PORT || 80;
global.HOSTURL = 'theideafarm.samlam.c9.io';

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
        clientId:'912341550131.apps.googleusercontent.com',
        clientSecret:'6sSOXRNsywDWUrJ5pNMxmJr8',
        accessReturnUrl: global.HOSTURL + '/auth/google/callback'
    }
};

module.exports = common;
