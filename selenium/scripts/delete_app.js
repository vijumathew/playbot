var Util = require("./utils.js")
 
var DeleteApp = function() {
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
      util.action("Click on element", ['a', userOptions.title]);
    });

    util.step("Wait for app page to load", function() {
      client.waitFor('ol', util.TIMEOUT, util.onTimeout("Wait for app page to load"));
    }, function() {
      util.action("Click on element", ['a', 'Delete this app']);
    });

    util.step("Wait for deletion popup", function() { 
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
