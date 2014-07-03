var action = function(description, callback) {
    if (callback === undefined) {
        // run action
    }
    else {
        // enqueue action
    }
};

var step = function(description, waitFunction, callback) {

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
            runScript(client);
        });
    },
    startSelenium: function(callback) {
        callback(client);
    }
};

exports = module.exports = ScriptRunner;
