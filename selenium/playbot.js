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
    feat_graphic: "",
    hi_res: "",
    promo_graphic: "",
    screenshots_phone: "/home/viju/Pictures/dan.jpg",
    screenshots_7: "/home/viju/Pictures/dan.jpg",
    screenshots_10: "/home/viju/Pictures/jen.jpg",
    locations: "SELECT ALL COUNTRIES",
    content_guidelines: true,
    us_export_laws: true,
});
