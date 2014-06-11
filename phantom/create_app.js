var require = patchRequire(require);

var fs = require('fs');
var PlayBot = require('playbot').PlayBot;
var CommandHandler = require('playbot').CommandHandler;

var commandHandler = new CommandHandler("create_app.js");


var userOptions = commandHandler.parseArgs();
var playbot = new PlayBot(commandHandler.getAuthFromArgs());

var LOAD_URL = "https://play.google.com/apps/publish/";

playbot.openPage(LOAD_URL, function(page){
    var findFieldName = playbot.shortcuts.findFieldName;

    playbot.action("Click the Add New App button", function() {
        page.click('.upload-app-button a');
    });

    playbot.action("Do the first step", function() {
        page.click(".continueActionButton");
    });


    ///////////
    // Steps

    playbot.step("Wait for Manage Your Apps", 'waitForText', 'Recent Activity', function() {
        playbot.action("Click the Add New App button");
    });

    playbot.action("Do the first step");
});
