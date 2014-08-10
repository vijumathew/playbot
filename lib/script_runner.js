var CreateApp = require("./scripts/create_app.js");
var UpdateApp = require("./scripts/update_app.js");
var DeleteApp = require("./scripts/delete_app.js");
var PublishApp = require("./scripts/publish_app.js");
var UnpublishApp = require("./scripts/unpublish_app.js");
var ListApp = require("./scripts/list_app.js");

var ScriptRunner = {
  run: function(namespace, action, userOptions, callback) {
    console.log("running " + namespace + ":" + action + " with " + JSON.stringify(userOptions));
    this.startSelenium(function(client) {var script;
      if (action === "create") { 
        script = new CreateApp();
      }

      else if (action === "update") {
        script = new UpdateApp();
      }

      else if (action === "delete") {
        script = new DeleteApp();
      }

      else if (action === "publish") {
        script = new PublishApp();
      }

      else if (action === "unpublish") {
        script = new UnpublishApp();
      }

      else if (action === "list") {
        script = new ListApp();
      }

      script.runScript(client, userOptions, callback);
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
      //console.log(val);
      if(val.indexOf('jetty.jetty.Server')>-1){
        client = client.init();
        callback(client);
        client.end();
      }
    });

    seleniumServer.stderr.on('data', function (data) {
      //console.log('stderr: ' + data);
    });

    seleniumServer.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
  }
};

exports = module.exports = ScriptRunner;