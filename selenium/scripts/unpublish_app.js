var Util = require("./utils.js")
 
var UnpublishApp = function() {
  var util = new Util();
  this.runScript = function(client, userOptions) {

    util.init(client, userOptions);

    util.loginAndWait();

    util.step("Go to application page", function() {

    }, function() {
      util.action("Click on element", ['a', [userOptions.title, userOptions.title + " " + userOptions.version]]);
    });

    util.step("Wait for app page to load", function() {
      client.waitFor('ol', util.TIMEOUT, util.onTimeout("Wait for app page to load"));
    }, function() {
      util.action("Click on element", ['a', 'Unpublish this app']);
    });

    util.step("Wait for unpublishing to complete", function() {
      client.waitFor('div[data-notification-type="INFO"][aria-hidden="false"]', util.TIMEOUT, util.onTimeout("Wait for unpublishing to complete"));
    }, function() {

    });    
  }
  
  return this;
}
 
exports = module.exports = UnpublishApp;
