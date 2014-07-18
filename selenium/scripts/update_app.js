var Util = require("./utils.js")
 
var UpdateApp = function() {
  var util = new Util();
  this.runScript = function(client, userOptions) {
    util.stepClient = client;
    

    util.step("Blah blah");
  }
  
  return this;
}
 
exports = module.exports = UpdateApp;
