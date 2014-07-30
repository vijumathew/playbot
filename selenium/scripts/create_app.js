var Util = require("./utils.js")
 
var CreateApp = function() {
  var util = new Util();
  this.runScript = function(client, userOptions) {

    util.init(client, userOptions);

    util.loginAndWait();

    util.step("Go to new application screen", function() {

    }, function() {
      util.action("Click on element", ['button', 'Add new application']);
    });

    util.step("Wait for app dialogue", function() {
      client.waitFor(".popupContent fieldset", util.TIMEOUT, util.onTimeout("Wait for app dialogue"));
    }, function() {
      util.action("Fill in initial app information");
      util.action("Click on element", ['button', 'Upload APK']);
    });

    util.uploadAPK(function() {

      util.step("Set APK waiting id", function() {

      }, function() {
        client.execute(function(upload_id){
          var p = document.getElementsByTagName('p');
          for (var i =0; i < p.length; i++) { 
            if (p[i].innerText.trim()==="Supported devices") { 
              p[i].parentElement.id = upload_id;
              break;
            } 
          }
        }, [util.upload_apk_id]);
      });

      util.step("Wait for APK upload", function() {
        client.waitForVisible('#' + util.upload_apk_id, util.TIMEOUT * 10, util.onVisibleTimeout("Wait for APK upload"));
      }, function() {
        
      });
    });

    util.step("Go to Store Listing", function() {

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

    util.uploadImagesAndWait("", userOptions);

    util.step("Save page", function() {

    }, function() {
      util.action("Click on element", ['div', 'Save']);
    });

    util.waitForSavedDocument();

    util.step("Go to Pricing & Distribution page", function() {
      
    }, function() {
      util.action("Click on element", ['a', 'Pricing & Distribution']);
    });

    util.step("Wait for Pricing & Distribution page", function() {
      client.waitFor('colgroup', util.TIMEOUT, util.onTimeout("Wait for Pricing & Distribution page"));
    }, function() {
      util.action("Fill in Pricing & Distribution information - locations");
      util.action("Fill in Pricing & Distribution information - education");
      util.action("Fill in Pricing & Distribution information - opt in");
      util.action("Click on element", ['div', 'Save']);
    });

    util.waitForSavedDocument();

  }
  
  return this;
}
 
exports = module.exports = CreateApp;