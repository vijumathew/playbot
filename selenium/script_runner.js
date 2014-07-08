var _actions = {};

var action = function(description, callback) {
    if (callback === undefined) {    
        //TODO: error logging like applebot
        _actions[description]();
    }
    else {
        _actions[description] = callback;
    }
};

var step = function(description, waitFunction, callback) {
    waitFunction();
    callback();
};


var runScript = function(client, appSettings) {
    action("Do something", function() {
        client.click("#")
    });

    step("Wait for something", function() {
        client.waitFor("div[data-stickyscrolling-placeholder]", TIMEOUT);
    }, function() {
        // when done
        action("Do something");
    });
}

var ScriptRunner = {
    run: function(namespace, action, userOptions) {
        console.log("running " + namespace + ":" + action + " with " + JSON.stringify(userOptions));

        startSelenium(function(client) {

            var selenium = require('selenium-standalone');
            var seleniumServer = selenium({stdio: 'pipe'});

            seleniumServer.stdout.on('data', function(output) {
                var val = output.toString().trim();
                console.log(val);
                if(val.indexOf('jetty.jetty.Server')>-1){
                    client = client.init();
                    start();
                }
            });

            seleniumServer.stderr.on('data', function (data) {
              console.log('stderr: ' + data);
            });

            seleniumServer.on('close', function (code) {
              console.log('child process exited with code ' + code);
            });

            function start() {
                runScript(client, userOptions);
            }

        });
    },
    startSelenium: function(callback) {

        var webdriverjs = require('webdriverjs');
        var driverOptions = {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        };
        var client = webdriverjs.remote(driverOptions);

        callback(client);
    }
};

exports = module.exports = ScriptRunner;
