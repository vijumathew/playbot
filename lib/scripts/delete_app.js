var Util = require("./utils.js")
 
var DeleteApp = function() {
  var util = new Util();
  this.runScript = function(client, userOptions) {

    util.init(client, userOptions);

    util.loginAndWait();

    util.step("Go to application page", function() {

    }, function() {
      util.action("Click on element", ['a', userOptions.title]);
    });

    util.step("Wait for app page and begin deletion process", function() {
      client.waitFor('ol', util.TIMEOUT, util.onTimeout("Wait for app page to load"));
    }, function() {
      util.action("Click on element", ['a', 'Delete this app']);
    });

    util.step("Wait for and click on deletion popup", function() { 
      client.waitFor('.popupContent', util.TIMEOUT, util.onTimeout("Wait for deletion popup"));
    }, function() {
      util.action("Click on element", ['button', 'Delete']);
    })

    util.step("Wait for deletion to complete", function() {
      client.waitFor('table tr a', util.TIMEOUT, util.onTimeout("Wait for deletion to complete"));
    }, function() {

    });    
  }
  
  return this;
}
 
exports = module.exports = DeleteApp;
