var CreateApp = require("./scripts/create_app.js");
var UpdateApp = require("./scripts/update_app.js");

var ScriptRunner = {
  run: function(namespace, action, userOptions) {
    console.log("running " + namespace + ":" + action + " with " + JSON.stringify(userOptions));
    this.startSelenium(function(client) {var script;
      if (action === "create") { 
        script = new CreateApp();
      }

      else if (action === "update") {
        script = new UpdateApp();
      }
      script.runScript(client, userOptions);
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

    var selenium = require('selenium-standalone');
    var seleniumServer = selenium({stdio: 'pipe'});

    seleniumServer.stdout.on('data', function(output) {
      var val = output.toString().trim();
      console.log(val);
      if(val.indexOf('jetty.jetty.Server')>-1){
        client = client.init();
        callback(client);
        client.end();
      }
    });

    seleniumServer.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    seleniumServer.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
  }
};

exports = module.exports = ScriptRunner;
