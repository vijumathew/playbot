var Util = require("./utils.js")
 
var UpdateApp = function() {
  var util = new Util();
  this.runScript = function(client, userOptions) {

    util.init(client, userOptions);

    util.loginAndWait();

    util.step("Go to application page", function() {

    }, function() {
      util.action("Click on element", ['a', userOptions.title]);
    });

    util.step("Wait for app page to load", function() {
      client.waitFor('ol', util.TIMEOUT, util.onTimeout("Wait for app page to load"));
    }, function() {
      
    });

    //APK Steps begin here - think of better way to do this
    if (userOptions.hasOwnProperty("apk_path")) {
      util.step("Update APK commence", function() {

      }, function() {
        util.action("Click on element", ['a', 'APK']);
      });

      util.uploadAPK(function() {
        util.step("Wait for APK upload", function() {
          client.waitForVisible('#apk_uploading_id', util.TIMEOUT * 10, util.onVisibleTimeout("Wait for APK upload"));
        }, function() {
        
        });
      });
      
    }

    //Store Listing Steps begin here
    util.step("Update Store Listing commence", function() {

    }, function() {
      util.action("Click on element", ['a', 'Store Listing']);
    });

    util.step("Wait for Store Listing page", function() {
      client.waitFor('select', util.TIMEOUT, util.onTimeout("Wait for Store Listing page"));
      client.waitFor('input[type="file"]', util.TIMEOUT, util.onTimeout);
    }, function() {
      util.action("Set ids for Store Listing");
      util.action("Fill in Store Listing");
    });

    util.step("Remove screenshots and graphics", function() {

    }, function() {

      var screenshot_tags = {
        phone: 'Phone', 
        7: '7-inch tablet', 
        10: '10-inch tablet'
      };

      for (tag in screenshot_tags) {
        var pathString = userOptions['screenshots_' + tag];

        if (pathString !== undefined) {
          var label = screenshot_tags[tag];
          util.action('Remove screenshots', [label]);
        }
      }

      var graphic_tags = {
        'Hi-res icon': userOptions.hi_res,
        'Feature Graphic': userOptions.feat_graphic,
        'Promo Graphic': userOptions.promo_graphic
      }

      for (tag in graphic_tags) {
        var path = graphic_tags[tag];

        if (path !== undefined) {
          util.action("Remove graphic", [tag]);
        }
      }

    });

    util.uploadImagesAndWait(undefined, userOptions);

    util.step("Save page", function() {

    }, function() {
      util.action("Click on element", ['div', 'Save']);
    });

    util.waitForSavedDocument();

    //Pricing & Distribution Steps begin here
    util.step("Update Pricing & Distribution commence", function() {

    }, function() {
      util.action("Click on element", ['a', 'Pricing & Distribution']);
    });

    util.step("Wait for Pricing & Distribution page", function() {
      client.waitFor('colgroup', util.TIMEOUT, util.onTimeout("Wait for Pricing & Distribution page"));
    }, function() {

      //??
      userOptions['opt in'] = '';

      var attribs = ['education', 'opt in', 'locations'];

      for (option in userOptions) {
        if (attribs.indexOf(option) !== -1) {
          util.action("Fill in Pricing & Distribution information - " + option);
        }
      }

      util.action("Click on element", ['div', 'Save']);
    });

    util.waitForSavedDocument();
    
  }
  
  return this;
}
 
exports = module.exports = UpdateApp;