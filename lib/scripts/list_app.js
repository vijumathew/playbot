var Util = require("./utils.js")
 
var ListApp = function() {
  var util = new Util();
  this.runScript = function(client, userOptions, callback) {

    util.init(client, userOptions);

    util.action("Get list of apps", function() {
      client.execute(function() {
        var elems=document.querySelectorAll('tr[__gwt_row]'); 
        var l = [];

        for (var i = 0; i < elems.length; i++) {
          l[l.length] = elems[i].children[0].innerText.trim();
        }

        return l;

      }, function(err, res) {
        var app_list = res.value;
        console.log(JSON.stringify({apps: app_list}));
        if (callback) {
          callback(err, app_list);
        }
      });
    });

    util.loginAndWait();

    util.step("Get list of apps", function() {

    }, function() {
      util.action("Get list of apps");
    });
  }
  
  return this;
}
 
exports = module.exports = ListApp;