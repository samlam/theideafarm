'use strict';
/* 
    Global section
*/


/*
    Commmon object for imported modules
*/
global.APIBASEPATH = 'http://192.168.0.143:8889';
global.APPPORT = 8001;
var common = {
    util : require('util'),         //from node
    events : require('events'),     //from node
    fs : require('fs'),             //from node
    http : require('http')         //from node

}



module.exports = common;
