var Util = require("./utils.js")
 
var CreateApp = function() {
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
      util.action("Click on Add new app");
    });

    util.step("Wait for app dialogue", function() {
      client.waitFor(".popupContent fieldset", util.TIMEOUT, util.onTimeout("Wait for app dialogue"));
    }, function() {
      util.action("Fill in and submit initial app information");
    });

    util.step("Wait for APK page", function() {
      client.waitFor("div[data-stickyscrolling-placeholder]", util.TIMEOUT, util.onTimeout("Wait for APK page"));
    }, function() {
      util.action("Go to APK upload");
      util.action("Find APK input element");
    });

    util.step("Wait for APK box", function() {
      client.waitFor("#correct_div", util.TIMEOUT, util.onTimeout("Wait for APK box"));
    }, function() {
      util.action("Upload APK");
    });

    util.step("Wait for APK upload", function() {
      client.waitForVisible('#apk_uploading_id', util.TIMEOUT * 10, util.onTimeout("Wait for APK upload"));
    }, function() {
      util.action("Go to Store Listing page");
    });

    util.step("Wait for Store Listing page", function() {
      client.waitFor('select', util.TIMEOUT, util.onTimeout("Wait for Store Listing page"));
    }, function() {
      util.action("Fill in Store Listing information - text and select");
      util.action("Fill in Store Listing information - other info");
      util.action("Upload graphics and screenshots");
    });

    util.step("Wait for screenshots and graphics to finish uploading", function() {

      var waiting_id_list = [];
      splitter = ','

      var pairings = {
        'Hi-res icon': [userOptions.hi_res],
        'Feature Graphic': [userOptions.feat_graphic],
        'Promo Graphic': [userOptions.promo_graphic],
        "Phone" : userOptions.screenshots_phone.split(splitter),
        "7-inch tablet" : userOptions.screenshots_7.split(splitter),
        "10-inch tablet" : userOptions.screenshots_10.split(splitter)
      }

      var items = 0;
      for (j in pairings){
        array = pairings[j];
        for (l in array){
          if (array[l] !== ''){
            items ++;
          }
        }
      }

      for (i=0; i<items; i++) {
        var id = "waiting_id_" + i;

        client.waitForVisible('#' + id, util.TIMEOUT * 10, 
          util.onVisibleTimeout("Wait for screenshots and graphics to finish uploading id = " + id));
      }

    }, function() {
      util.action("Click save button");
    });

    util.step("Wait for completely saved document", function() {
      client.waitFor("#documentCompletelySaved", util.TIMEOUT, util.onTimeout("Wait for completely saved document"));
    }, function() {
      util.action("Go to Pricing & Distribution page");
    });

    util.step("Wait for Pricing & Distribution page", function() {
      client.waitFor('colgroup', util.TIMEOUT, util.onTimeout("Wait for Pricing & Distribution page"));
    }, function() {
      util.action("Fill in Pricing & Distribution information - locations");
      util.action("Fill in Pricing & Distribution information - education");
      util.action("Fill in Pricing & Distribution information - opt in");
      util.action("Click save button");
    });

    util.step("Wait for completely saved document", function() {
      client.waitFor("#documentCompletelySaved", util.TIMEOUT, util.onTimeout("Wait for completely saved document"));
    }, function() {

    });
  }
  
  return this;
}
 
exports = module.exports = CreateApp;
