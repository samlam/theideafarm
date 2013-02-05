'use strict';
/* 
    Global section
*/


/*
    Commmon object for imported modules
*/
global.APIBASEPATH = 'http://api.samlam.com:89';
global.APPPORT = 80;
var common = {
    util : require('util'),         //from node
    events : require('events'),     //from node
    fs : require('fs'),             //from node
    http : require('http')         //from node
};

module.exports = common;
