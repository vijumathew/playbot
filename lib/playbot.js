var webdriverjs = require('webdriverjs');
var selenium = require('selenium-standalone');
var extend = require('util')._extend;

var Namespaces = require('./commands');
var PlayBot = {};

exports = module.exports = PlayBot;

extend(PlayBot, Namespaces);