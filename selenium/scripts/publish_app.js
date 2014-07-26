var Util = require("./utils.js")
 
var PublishApp = function() {
  var util = new Util();
  this.runScript = function(client, userOptions) {

    util.init(client, userOptions);

    util.step("Log in to page", function() {

    }, function() {
      util.action("Login");
    });

    util.step("Wait for login to complete", function() {
      client.waitFor('table tr a', util.TIMEOUT, util.onTimeout("Wait for login to complete"));
    }, function() {
      util.action("Click on element", ['a', userOptions.title + " " + userOptions.version]);
    });

    util.step("Wait for app page to load", function() {
      client.waitFor('ol', util.TIMEOUT, util.onTimeout("Wait for app page to load"));
    }, function() {
      util.action("Click on element", ['a', ['Re-publish this app', 'Publish this app']]);
    });

    util.step("Wait for publishing to complete", function() {
      client.waitFor('div[data-notification-type="INFO"][aria-hidden="false"]', util.TIMEOUT, util.onTimeout("Wait for publishing to complete"));
    }, function() {

    });    
  }
  
  return this;
}
 
exports = module.exports = PublishApp;
