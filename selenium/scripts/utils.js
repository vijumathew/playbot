var Util = function() {
  this._stepClient = null;
  this.TIMEOUT = 5*1000;

  var _actions = {};

  this.init = function(client, appSettings) {
    initVariables(client, appSettings);
    initActions(this, client, appSettings);
  }

  var initVariables = function(client, appSettings){
    if (!isUndefined(appSettings.output_format)) {
      $outputFormat = appSettings.output_format;
    }

    _stepClient = client;
  }

  var initActions = function(util, client, appSettings) {

    if (!isUndefined(appSettings.output_format)) {
      $outputFormat = appSettings.output_format;
    }

    function searchForChild(parentTag, attribute, match, nested, childTag, childID, client){
      client.execute(function(parentTag, attribute, match, nested, childTag, childID) {
        var elements = document.querySelectorAll(parentTag);
        var correct_element = null;
        for(var i = 0; i < elements.length; i++) {
          var element = elements[i];
          if (element[attribute] === null) {}
          else if (element[attribute].trim() === match) {
            correct_element = element;
          }
        }
        var i = 0;
        while (i < nested){
          correct_element = correct_element.parentElement;
          i++;
        }
        
        var child = correct_element.querySelector(childTag);
        child.id = childID;
        console.log(child);

      }, [parentTag, attribute, match, nested, childTag, childID]);

      return childID;
    }
    
    util.action("Set ids for Store Listing", function() {
      client.execute(function(){
        var selectAreas = document.querySelectorAll('select');
        selectAreas[0].id = "selectArea_app_type";
        selectAreas[1].id = "selectArea_category";
        selectAreas[2].id = "selectArea_rating";

        var textAreas = document.getElementsByTagName('textArea');
        textAreas[0].id = "textArea_subtext"; //subtext
        textAreas[1].id = "textArea_promo"; //promo text
      });

      var shortcutSearch = function(tag, label, count, id){
        return searchForChild(tag, 'innerText', label, count, 'input', id, this._stepClient);
      };

      shortcutSearch('p', 'Promo Video', 2, 'textArea_promo_vid');
      shortcutSearch('div', 'Website', 1, 'textArea_website');
      shortcutSearch('div', 'Email', 1, 'textArea_email');
      shortcutSearch('div', 'Phone', 1, 'textArea_phone');
      shortcutSearch('div', 'Privacy Policy', 1, 'textArea_privacy');
      shortcutSearch('span', 'Not submitting a privacy policy URL at this time. Learn more', 
        0,'privacy_opt_out_id');
    });

    util.action("Fill in Store Listing", function() {

      selectFields = ['app_type', 'category', 'rating'];
      textFields = ['subtext', 'promo', 'promo_vid', 'website', 'email', 'phone'];

      for (option in appSettings) {
        if (selectFields.indexOf(option) !== -1) {
          client.click('#selectArea_' + option + ' option[value = ' + appSettings[option] + ']')
        }

        else if (textFields.indexOf(option) !== -1) {
          client.setValue('#textArea_' + option, appSettings[option]);
        }

        else if (option === 'privacy') {
          if (option) {
            client.setValue("#textArea_" + option, appSettings[option]);
          }
          else {
            client.click("#privacy_opt_out_id");
          }
        }
      }
    });

    util.action("Click on element", function(tag, text) {

      client.execute(function(tag, text) {

        var elements = document.getElementsByTagName(tag);
        var found = false;
        for (var i = 0; i < elements.length; i++) {
          element = elements[i];

          if (typeof(text) === "string"){
            text = [text];
          }

          if (text.indexOf(element.innerText.trim()) !== -1) {
            element.click();
            found = true;
            break;
          }
        }
        return found;

      }, [tag, text], function(err, res) {
        if (!res.value) {
          client.getSource( function(err, res) {
            die(res, "Could not find <" + tag + "> with text '" + text + "'");
          })

        }
      });
    });

    util.action("Login", function(){
      client.url('https://play.google.com/apps/publish');
      client.setValue('#Email', appSettings.email, function(err, res) {

      });
      client.setValue('#Passwd', appSettings.password, function(err, res) {

      });
      client.submitForm('form#gaia_loginform', function(err, res) {

      });
    });

    util.action("Fill in initial app information", function() {
      client.setValue(".popupContent .gwt-TextBox", appSettings.title, function(err, res) {

      });
    });

    util.action("Upload APK", function() {

      client.chooseFile('input[type="file"]', appSettings.apk_path, function(err, res){

      });

    }); 

    util.action("Remove graphic", function(title) {

      var upload_id = searchForChild('h5', 'innerText', title, 2, 'input', (title+'_online_id').replace(' ', '_'), client);

      client.execute(function(id) {
        var input = document.getElementById(id);
        var x_divs = input.parentElement.parentElement.getElementsByTagName('div');

        for (i = 0; i < x_divs.length; i++) {
          if (x_divs[i].innerHTML.charCodeAt(0) === 215) {
            x_divs[i].click();
          }
        }
      }, [upload_id]);
    });

    util.action("Upload graphic", function(title, id, path) {
      
      var upload_id = searchForChild('h5', 'innerText', title, 2, 'input', id+'_upload', client);

      console.log("upload id " + upload_id);

      client.chooseFile("#" + upload_id, path, function(err, res){
        console.log("err: " + err);
        console.log("res: " + res);
      });

      client.execute(function(upload_id, waiting_id){
        var input = document.querySelector("#" + upload_id);
        toWatch = input.parentElement.parentElement.children[2];
        toWatch.id = waiting_id;
        console.log(toWatch);
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

    util.action("Fill in Pricing & Distribution information - locations", function() {
      client.execute(function(listOfCountries){

        var labels = document.querySelector('h4').parentElement.getElementsByTagName('label');
        for (var i = 0; i <labels.length; i++) {
          var input = labels[i].querySelector('input');

          if (!input){
            continue;
          }

          if (listOfCountries.indexOf(labels[i].innerText) !== -1 ){
            input.checked = false;
            input.click();
          }

          else{
            input.checked = false;            
          }
        }

      }, [appSettings.locations]);
    });

    util.action("Fill in Pricing & Distribution information - education", function() {

      if (appSettings.education){  
        client.execute(function(){
          var field = document.getElementsByTagName('fieldset')[1];
          field.querySelector('input').click();
        });
        
        client.waitFor('div.popupContent', TIMEOUT, function(err,res){

        });
        
        client.execute(function(ads, purchases){
          var divs = document.getElementsByTagName('div');
          for (var i =0; i < divs.length; i++){
            var div = divs[i];
            if (div.innerText === 'Continue'){
              correct_div.parentElement.click();
            }
          }

          var popUp = document.querySelector('div.popupContent');

          var inputs = popUp.getElementsByTagName('input');

          if (ads){
            inputs[0].click();
          }
          else{
            inputs[1].click();
          }
          if (purchases){
            inputs[2].click();
          }
          else{
            inputs[3].click();
          }

          var buttons = popUp.getElementsByTagName('button');
          for (i in buttons){
            var button = buttons[i];
            if (button.innerText.trim() === 'Save'){
              button.click();
              break;
            }
          }

        }, [appSettings.education_ads, appSettings.education_purchases]);  
      }
    });
    
    util.action("Fill in Pricing & Distribution information - opt in", function() {
      client.execute(function(optInValues){
        
        var labels = document.getElementsByTagName('fieldset')[2].querySelectorAll('fieldset > label');
        for (var i = 0; i < labels.length; i++){
          if (optInValues[i]){
            labels[i].querySelector('input').checked = false;
            labels[i].querySelector('input').click();

          }
          else if (optInValues[i] === false){
            labels[i].querySelector('input').checked = false; 
          }
        }
      }, [ [appSettings.marketing_opt_out, appSettings.content_guidelines, appSettings.us_export_laws] ]);
    }); 

    util.action("Fill in APK update popup", function() {

      var expansion_file_id = 'expansion_file_id';
      var changelog_id = 'changelog_id';

      searchForChild('div', 'innerText', 'Use expansion file', 1, 'input', expansion_file_id);
      searchForChild('div', 'innerText', "What's new in this version?", 1, 'textArea', changelog_id);

      if (appSettings.hasOwnProperty('expansion_file_path')) {
        client.chooseFile('#' + expansion_file_id, appSettings.expansion_file_path, function(err, res){

        });
      }

      if (appSettings.hasOwnProperty('changelog')) {
        client.setValue('#' + changelog_id, appSettings.changelog);
      }

      if (appSettings.publish !== false) {
        client.execute(function() {
          var popUp = document.querySelector('div.popupContent'); 
          var spans = popUp.querySelectorAll('span'); 
          for (var i = 0; i < spans.length; i++) {
            if (spans[i].innerText.trim() === 'Publish as staged rollout') {
              spans[i].click();
              break;
            }
          }
        });

        client.waitFor('input[type="radio"]', util.TIMEOUT, util.onTimeout("Wait for APK rollout selector"));

        client.execute(function(percent) {
          if (percent === "100%" || percent === undefined) {
            percent = "100%\nfull rollout, completely replaces the old configuration";
          }
          if (percent.toString().indexOf('%') === -1) {
            percent += '%';
          }
          var popUp = document.querySelector('div.popupContent');
          var spans = popUp.getElementsByTagName('span');
          for (var i = 0; i < spans.length; i++) {
            if (spans[i].innerText.trim() === percent) {
              spans[i].querySelector('input').click();
            }
          }
          popUp.querySelector('button').click();
        }, [appSettings.publish_percent]);
      }

      else {
        client.execute(function() {
          var popUp = document.querySelector('div.popupContent'); 
          var buttons = popUp.querySelectorAll('button'); 
          for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText.trim() === 'Save') {
              buttons[i].click();
              break;
            }
          }
        });
      }
    });

  }

  this.upload_apk_id = 'apk_uploading_id';

  this.uploadAPK = function(set_waiting_id) {

    var _this = this;

    this.step("Wait for APK page", function() {
      _stepClient.waitFor('thead', _this.TIMEOUT, _this.onTimeout("Wait for APK page to load"));
      _stepClient.waitFor("div[data-stickyscrolling-placeholder]", _this.TIMEOUT, _this.onTimeout("Wait for APK page"));
    }, function() {
      _this.action("Click on element", ['button', ['Upload new APK to Production', 'Upload your first APK to Production']]);
    });

    this.step("Wait for APK box", function() {
      _stepClient.waitFor('input[type="file"]', _this.TIMEOUT, _this.onTimeout("Wait for APK box"));
    }, function() {
      _this.action("Upload APK");
      set_waiting_id();
    });

    this.step("Wait for APK upload", function() {
      _stepClient.waitForVisible('#' + _this.upload_apk_id, this.TIMEOUT * 10, _this.onVisibleTimeout("Wait for APK upload"));
    }, function() {

    });

  }

  this.uploadImagesAndWait = function(obj, userOptions) {

    var _this = this;

    this.step("Upload screenshots and graphics", function() {

    }, function() {

      var screenshot_tags = {
        phone: 'Phone', 
        7: '7-inch tablet', 
        10: '10-inch tablet'
      };

      for (tag in screenshot_tags) {
        var pathString = userOptions['screenshots_' + tag];

        if (pathString !== obj) {
          var label = screenshot_tags[tag];
          var paths = pathString.split(',');

          for (var i = 0; i < paths.length; i++) {
            var id = ('screenshot_' + label + '_' + i).replace(' ', '_');
            path = paths[i];
            _this.action('Upload screenshot', [label, id, path]);
          }
        }
      }

      var graphic_tags = {
        'Hi-res icon': userOptions.hi_res,
        'Feature Graphic': userOptions.feat_graphic,
        'Promo Graphic': userOptions.promo_graphic
      }

      graphicsCount = 0;

      for (tag in graphic_tags) {
        var path = graphic_tags[tag];

        if (path !== obj) {
          var id = "graphic_" + graphicsCount;
          _this.action("Upload graphic", [tag, id, path]);
          graphicsCount++;
        }
      }

    });

    this.step("Wait for screenshots and graphics to finish uploading", function() {

      var waiting_id_list = [];

      var graphic_items = [userOptions.hi_res, userOptions.feat_graphic, userOptions.promo_graphic];

      for (i in graphic_items) {
        if (graphic_items[i] !== "" && graphic_items !== null) {
          waiting_id_list[waiting_id_list.length] = 'graphic_' + i;
        }
      }

      var screenshot_items = {
        "Phone" : userOptions.screenshots_phone,
        "7-inch tablet" : userOptions.screenshots_7,
        "10-inch tablet" : userOptions.screenshots_10
      };

      for (i in screenshot_items) {
        if (screenshot_items[i] !== "" && screenshot_items[i] !== null) {
          var screenshot_array = screenshot_items[i].split(',');
          for (var j = 0; j < screenshot_array.length; j++){
            waiting_id_list[waiting_id_list.length] = ('screenshot_' + i + '_' + j).replace(' ', '_');
          }
        }
      }

      for (i in waiting_id_list) {
        var id = waiting_id_list[i];
        _stepClient.waitForVisible('#' + id, _this.TIMEOUT * 10, 
          _this.onVisibleTimeout("Wait for screenshots and graphics to finish uploading id = " + id));
      }
    }, function() {

    });
  }

  this.loginAndWait = function() {

    var _this = this;

    this.step("Log in to page", function() {

    }, function() {
      _this.action("Login");
    });

    this.step("Wait for login to complete", function() {
      _stepClient.waitFor('table tr a', _this.TIMEOUT, _this.onTimeout("Wait for login to complete"));
    }, function() {

    });
  }

  this.waitForSavedDocument = function() {

    var _this = this;

    this.step("Wait for completely saved document", function() {
      _stepClient.waitFor('div[data-notification-type="INFO"][aria-hidden="false"]', _this.TIMEOUT, _this.onTimeout("Wait for completely saved document"));
    }, function() {

    });
  }

  var merge = function(obj1,obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  };

  var isFunction = function(obj) {
    return typeof(obj) === 'function';
  };

  var isUndefined = function(obj) {
    return obj === void(0);
  };

  var $outputFormat;

  var jsonLog = function(obj) {
    console.log(JSON.stringify(obj));
  };

  console.formatLog = function(string, json) {
    if ($outputFormat === 'json') {
      jsonLog(merge({normal_output: string}, json));
    }
    else if (string.length > 0) {
      console.log(string);
    }
  };

  var dieFromException = function(source, ex, metadata) {
    if (isUndefined(metadata)) {
      metadata = {};
    }
    metadata.stack = ex.stack;
    die(source, ex.message, metadata);
  };

  var die = function(source, message, metadata) {
    if (isUndefined(metadata)) {
      metadata = {};
    }
    console.formatLog("", {event: "debug_html", source: source});
    var error = merge({event: "error", message: message}, metadata);
    console.formatLog("☠ " + message, error);

    throw "☠ " + message;
  };

  var logStepStart = function(stepName) {
    console.formatLog("- " + stepName, {event: "step_start", name: stepName});
  };

  var logStepComplete = function(stepName) {
    console.formatLog("✔ " + stepName, {event: "step_complete", name: stepName});
  };

  var logActionStart = function(actionName) {
    console.formatLog("- " + actionName, {event: "action_start", name: actionName});
  };

  var logActionComplete = function(actionName) {
    console.formatLog("✔ " + actionName, {event: "action_complete", name: actionName});
  };

  var logStepFail = function(stepName) {
    console.formatLog("! " + stepName, {event: "step_fail", name: stepName});
  };

  var logPageError = function(error) {
    console.formatLog("X - " + errors[i], {event: "page_error", error: error});
  };

  var runAction = function(actionName, actionArgs) {
    var actionLog = actionName;
    if (actionArgs) {
      actionLog = actionName + ': ' + actionArgs;
    }
    var action = _actions[actionName];
    if (action) {
        logActionStart(actionLog);
        try {
          if (actionArgs) {
            action.apply(null, actionArgs);
          }
          else {
            action();
          }
            logActionComplete(actionLog);
        } catch (ex) {
            _stepClient.getSource(function(err,res){
                dieFromException(res, ex, {action: actionLog});
            });
        }
    }
    else {
        _stepClient.getSource(function(err,res){
            die(res, "Could not find registered action for '" + actionName + "'");
        });
    }
  };

  var addAction = function(actionName, actionImpl) {
    _actions[actionName] = actionImpl;
  };

  this.action = function(actionName, actionImpl) {
    if (isUndefined(actionImpl)) {
      runAction(actionName);
    }
    else if (typeof(actionImpl) !== 'function') {
      runAction(actionName, actionImpl);
    }
    else {
      addAction(actionName, actionImpl);
    }
  };

  this.step = function(stepName, waitFunction, callback) {
    _stepClient.call(function() {
        logStepStart(stepName);
    });
    waitFunction();
    _stepClient.call(function() {
        try {
          callback();
        }
        catch (ex){
          logStepFail(stepName);
          _stepClient.getSource(function(err, res){
              dieFromException(res, ex, {step: stepName});
          });
        }
    });

    _stepClient.call(function() {
        logStepComplete(stepName);
    });
  };

  this.onTimeout = function(stepName) {
    return function(err, res){
      if (!res){
        logStepFail(stepName);
        _stepClient.getSource(function(err,res){
          die(res, "Timeout for step: '" + stepName + "'");
        });
      }
    }
  }

  this.onVisibleTimeout = function(stepName) {
    return function(err) {
      if (!isUndefined(err)){
        logStepFail(stepName);
        _stepClient.getSource(function(err, res){
          die(err, "Timeout for step: '" + stepName + "'");
        });
      }
    }
  }

  
  return this;
}
 
exports = module.exports = Util;
