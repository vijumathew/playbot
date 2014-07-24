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
        if (userOptions[attribute] !== null) {
          client.click('#selectArea_' + attribute + ' option[value = ' + userOptions[attribute] + ']')
        }
      }
    });

    util.action("Remove graphic", function(title) {

      var upload_id = searchForChild('h5', 'innerText', title, 2, 'input', (title+'_online_id').replace(' ', '_'), client);

      client.execute(function(id) {
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

    util.action("Upload graphic", function(title, id, path) {
      
      var upload_id = searchForChild('h5', 'innerText', title, 2, 'input', id+'_upload', client);

      client.chooseFile("#" + upload_id, path, function(err, res){
            
      });

      client.execute(function(upload_id, waiting_id){
        var input = document.querySelector("#" + upload_id);
        toWatch = input.parentElement.parentElement.children[2];
        toWatch.id = waiting_id;
      }, [upload_id, id]);
    });

    util.action("Remove screenshots", function(tag) {

      client.execute(function(type) {
        var divs = document.querySelectorAll('b');
        var correct_div = null; 
        for (var i =0; i <divs.length; i++) { 
          if (divs[i].innerText.trim() === type) {
            correct_div = divs[i];
            break;
          }
        }

        var x_divs = correct_div.parentElement.parentElement.getElementsByTagName('div');
        for (i = 0; i < x_divs.length; i++) {
          if (x_divs[i].innerHTML.charCodeAt(0) === 215) {
            x_divs[i].click();
          }
        }
      }, [tag]);
    });

    util.action("Upload screenshot", function(type, id, path) {

      client.execute(function(type, id){

        var divs = document.querySelectorAll('b');
        var correct_div = null; 
        for (var i =0; i <divs.length; i++) { 
          if (divs[i].innerText.trim() === type) {
            correct_div = divs[i];
            break;
          }
        }
        var parent = correct_div.parentElement.parentElement;
        var inputs = parent.querySelectorAll('input');
        var input = inputs[inputs.length-1];

        input.id = id + '_upload';

        waiting = input.parentElement.parentElement.children[2];
        waiting.id = id;

      }, [type, id]);

      client.chooseFile("#" + id + '_upload', path, function(err, res){

      });
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
      });
    });

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
      util.action("Go to APK page");
    });

    util.step("Wait for APK page to load", function() {
      client.waitFor('thead', util.TIMEOUT, util.onTimeout("Wait for APK page to load"));
    }, function() {
      //util.action("Click on Upload New APK");
    });

    //copied from create_app.js p much
    util.step("Wait for APK popup", function() {
      //client.waitFor('.popupContent', util.TIMEOUT, util.onTimeout("Wait for popup"));
    }, function() {
      //util.action("Find APK input element");
    });

    util.step("Wait for APK box", function() {
      //client.waitFor("#correct_div", util.TIMEOUT, util.onTimeout("Wait for APK box"));
    }, function() {
      //util.action("Upload APK");
    });

    util.step("Wait for APK upload", function() {
      //client.waitForVisible('#apk_uploading_id', util.TIMEOUT * 10, util.onTimeout("Wait for APK upload"));
    }, function() {
      util.action("Go to Store Listing page");
    });

    util.step("Wait for Store Listing page", function() {
      client.waitFor('select', util.TIMEOUT, util.onTimeout("Wait for Store Listing page"));
    }, function() {

      //util.action("Update Store Listing information - select");

      //if options[value] === null it doesn't update anything
      //util.action("Fill in Store Listing information - text");
      //util.action("Fill in Store Listing information - privacy");

      var screenshot_tags = {
        phone: 'Phone', 
        7: '7-inch tablet', 
        10: '10-inch tablet'
      };

      for (tag in screenshot_tags) {
        var pathString = userOptions['screenshots_' + tag];

        if (pathString !== null) {
          var label = screenshot_tags[tag];
          util.action('Remove screenshots', [label]);
          var paths = pathString.split(',');

          for (i in paths) {
            var id = ('screenshot_' + label + '_' + i).replace(' ', '_');
            path = paths[i];
            util.action('Upload screenshot', [label, id, path]);
          }
        }
      }

      var graphic_tags = {
        'Hi-res icon': userOptions.hi_res,
        'Feature Graphic': userOptions.feat_graphic,
        'Promo Graphic': userOptions.promo_graphic
      }

      for (tag in graphic_tags) {
        graphicsCount = 0;
        var path = graphic_tags[tag];

        if (path !== null) {
          util.action("Remove graphic", [tag]);

          var id = "graphic_" + graphicsCount;
          util.action("Upload graphic", [tag, id, path]);
          graphicsCount++;
        }
      }

    });

    util.step("Wait for screenshots and graphics to finish uploading", function() {

      var waiting_id_list = [];
      splitter = ','

      var graphic_items = [userOptions.hi_res, userOptions.feat_graphic, userOptions.promo_graphic];

      for (i in graphic_items) {
        if (graphic_items[i] !== null) {
          waiting_id_list[waiting_id_list.length] = 'graphic_' + i;
        }
      }

      var screenshot_items = {
        "Phone" : userOptions.screenshots_phone,
        "7-inch tablet" : userOptions.screenshots_7,
        "10-inch tablet" : userOptions.screenshots_10
      };

      for (i in screenshot_items) {
        if (screenshot_items[i] !== null) {
          for (j in screenshot_items[i].split(',')){
            waiting_id_list[waiting_id_list.length] = ('screenshot_' + i + '_' + j).replace(' ', '_');
          }
        }
      }

      for (i in waiting_id_list) {
        var id = waiting_id_list[i];
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
      if (userOptions.locations !== null){
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
