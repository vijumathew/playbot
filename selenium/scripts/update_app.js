var Util = require("./utils.js")
 
var UpdateApp = function() {
  var util = new Util();
  this.runScript = function(client, userOptions) {

    util.action("Update Store Listing information - select", function() {

      client.execute(function(){
        var selectAreas = document.querySelectorAll('select');
        selectAreas[0].id = "selectArea_app_type";
        selectAreas[1].id = "selectArea_category";
        selectAreas[2].id = "selectArea_rating";
      });

      var select_attributes =  ['app_type', 'category', 'rating'];
      for (i in select_attributes) {
        attribute = select_attributes[i];
        if (!util.isUndefined(userOptions[attribute])) {
          client.click('#selectArea_' + attribute + ' option[value = ' + userOptions[attribute] + ']')
        }
      }
    });

    //figure out how to pass which graphic
    util.action("Remove graphic", function() {

      title = 'id of current graphic';
      var upload_id = searchForChild('h5', 'innerText', title, 2, 'input', (title+'_online_id').replace(' ', '_'), client);

      client.execute(function(id){
        var input = document.getElementById(id);
        var x_divs = input.parentElement.parentElement.getElementsByTagName('div');

        for (i in x_divs) { 
          d = x_divs[i]; 
          if (d.innerHTML === '×') {
            d.click();
          }
        }
      }, [upload_id]);
    });

    //figure out how to pass type
    util.action("Remove screenshots", function() {

      var type = 'id of screenshot type'

      client.execute(function(type){

        var divs = document.querySelectorAll('b');
        var correct_div = null; 
        for (var i =0; i <divs.length; i++) { 
          if (divs[i].innerText.trim() === type) {
            correct_div = divs[i];
            break;
          }
        }

        var x_divs = correct_div.parentElement.parentElement.getElementsByTagName('div');
        for (i in x_divs) { 
          d = x_divs[i]; 
          if (d.innerHTML === '×') {
            d.click();
          }
        }
      }, [type]);
    });
    
    util.action("Go to APK page", function() {
      client.execute(function(){
        var links =  document.getElementsByTagName('a');
        for (i in links){
          var link = links[i];
          if (link.innerText === "APK"){
            link.click();
            break;
          }
        }
      });
    })

    util.action("Click on Upload new APK", function() {
      client.execute(function() {
        buttons = document.getElementsByTagName('button');
        for (i in buttons) {
          b = buttons[i]; 
          if (b.innerText.trim() === 'Upload new APK to Production') {
            b.click();
            break;
          }
        }
      }
    })

    util.init(client, userOptions);

    util.step("Log in to page", function() {

    }, function() {
      util.action("Login");
    });

    util.step("Wait for login to complete", function() {
      client.waitFor('table tr a', util.TIMEOUT, util.onTimeout("Wait for login to complete"));
    }, function() {
      util.action("Click on existing app");
    });

    util.step("Wait for app page to load", function() {
      client.waitFor('ol', util.TIMEOUT, util.onTimeout("Wait for app page to load"));
    }, function() {
      util.action("Go to APK page");
    });

    util.step("Wait for APK page to load", function() {
      client.waitFor('thead', util.TIMEOUT, util.onTimeout("Wait for APK page to load"));
    }, function() {
      util.action("Click on Upload New APK");
    });

    util.step("Wait for popup", function() {
      client.waitFor('.popupContent', util.TIMEOUT, util.onTimeout("Wait for popup"));
    } function() {
      //APK upload
    });

    util.step("Wait for APK upload", function() {
      //client.waitForVisible('#apk_uploading_id', util.TIMEOUT * 10, util.onTimeout("Wait for APK upload"));
    }, function() {
      util.action("Go to Store Listing page");
    });

    util.step("Wait for Store Listing page", function() {
      client.waitFor('select', util.TIMEOUT, util.onTimeout("Wait for Store Listing page"));
    }, function() {

      util.action("Update Store Listing information - select");

      //if options[value] === null it doesn't update anything
      util.action("Fill in Store Listing information - text");
      util.action("Fill in Store Listing information - privacy");

      //get this working
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
      if (!util.isUndefined(userOptions.locations)){
        util.action("Fill in Pricing & Distribution information - locations");
      }

      //if value is null it leaves unchanged
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
 
exports = module.exports = UpdateApp;
