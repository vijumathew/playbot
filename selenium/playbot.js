var webdriverjs = require('webdriverjs');
var selenium = require('selenium-standalone');
var extend = require('util')._extend;

var Namespaces = require('./commands');

exports = module.exports = PlayBot;

var PlayBot = {};
extend(PlayBot, Namespaces);

PlayBot.app.create({email: "email@example.com",
    password: "xxxx",
    title: "Something",
    apk_path: "something.apk",
    subtext: "Description",
    app_type: "APPLICATION",
    category: "MUSIC_AND_AUDIO",
    rating: "TEEN",
    website: "http://usepropeller.com",
    public_email: "clay.allsopp@gmail.com",
    hi_res: "app_icon.png",
    screenshots_phone: "thing.png",
    screenshots_7: "thing2.png",
    screenshots_10: "thing3.png",
    locations: "SELECT ALL COUNTRIES",
    content_guidelines: true,
    us_export_laws: true
});
