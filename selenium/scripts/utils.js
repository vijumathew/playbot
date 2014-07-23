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

      }, [parentTag, attribute, match, nested, childTag, childID]);

      return childID;
    }

    util.action("Login", function(){
      client.url('https://play.google.com/apps/publish');
      client.setValue('#Email', appSettings.email, function(err, res) {

      });
      client.setValue('#Passwd', appSettings.password, function(err, res) {

      });
      client.submitForm('form#gaia_loginform', function(err, res) {

      });
    });

    util.action("Click on existing app", function(){
      var title = appSettings.title;
      client.execute(function(title) {
        var links = document.getElementsByTagName('a');
        for (var i in links) {
          var link = links[i];
          var found = false;
          if (link.innerText === title) {
            link.click();
            found = true;
            break;
          }
        }
      }, [title]);
    });

    util.action("Click on Add new app", function() {
      client.execute(function() {
        var spans = document.getElementsByTagName('span');
        correct_span = null;
        for(var i = 0; i < spans.length; i++) {
          var span = spans[i];
          if (span.innerHTML.trim() === "Add new application") {
            correct_span = span;
          }
        }
      var buttonId = correct_span.parentElement.parentElement.id;
      document.querySelector("button#" + buttonId).click();
      }, [], function(err, res) {
        var value = res.value;
      });
    });

    util.action("Fill in and submit initial app information", function() {
      client.setValue(".popupContent .gwt-TextBox", appSettings.title, function(err, res) {

      });
      client.execute(function() {
        var divs = document.getElementsByTagName('div');
        var correct_div = null;
        for (var i = 0; i <divs.length; i++){
          var div = divs[i];
          if (div.innerHTML.trim() === "Upload APK"){
            correct_div = div;
          }
        }
        var buttonId = correct_div.parentElement.id;
        document.querySelector("button#" + buttonId).click();
      }, [], function(err, res) {
        var value = res.value;
      });
    });

    util.action("Go to APK upload", function() {
      client.execute(function() {
        var divs = document.getElementsByTagName('div');
        matching_divs = [];

        for (var i = 0; i <divs.length; i++){
          var div = divs[i];
          if (div.innerHTML.trim() === "Upload your first APK to Production"){
            matching_divs[matching_divs.length] = div;
          }
        }

        var correct_div = null;
        for (var i = 0; i <matching_divs.length ; i++){
          var div = matching_divs[i];
          if (div.parentElement.parentElement.children.length===3){
            if (div.parentElement.parentElement.tagName === "DIV"){
              correct_div = div;
            }
          }
        }

        var buttonId = correct_div.parentElement.id;
        document.querySelector("button#" + buttonId).click();
      }, [], function(err, res) {
        var value = res.value;
      });
    });

    var specialId = "fileInputIdSecretString";

    util.action("Find APK input element", function() {

      client.execute(function(specialId) {
        var interval = window.setInterval(function() {
          var divs = document.getElementsByTagName('div');
          var correct_div = null;
          for (var i = 0; i <divs.length; i++){
            var div = divs[i];
            if (div.innerHTML.trim() === "Browse files"){
              console.log("HIT");
              correct_div = div;
            }
          }

          var anyHit = false;
          if (correct_div) {
            var nodes = correct_div.parentElement.parentElement.children;
            for (var i =0; i <nodes.length; i++){
              var node = nodes[i];
              if (node.tagName==="INPUT"){
                console.log("hit");
                node.id= specialId;
                node.addEventListener("change", function(e) {
                  console.log("NODE CHANGE");
                });
                anyHit = true;
              }
            }
          }

          if (anyHit) {
            correct_div.innerHTML = "shit";
            correct_div.id = "correct_div";
            window.clearInterval(interval);
          }
        }, 1000);

      }, [specialId], function(err, res) {

      });
    });

    //also used for a waitFor step -> there are some other hardcoded strings
    var upload_id = 'apk_uploading_id';

    util.action("Upload APK", function() {
      client.chooseFile("#" + specialId, appSettings.apk_path, function(err, res) {

      });

      client.execute(function(upload_id){
        var p = document.getElementsByTagName('p');
        for (i in p) { 
          if (p[i].innerText.trim()==="Supported devices") { 
            p[i].parentElement.id = upload_id;
            break;
          } 
        }

      }, [upload_id]);
    });

    util.action("Go to Store Listing page", function() {
      client.execute(function(){
        var links =  document.getElementsByTagName('a');
        for (i in links){
          var link = links[i];
          if (link.innerText === "Store Listing"){
            link.click();
            break;
          }
        }
      });
    });

    util.action("Fill in Store Listing information - select", function() {

      client.execute(function(){
        var selectAreas = document.querySelectorAll('select');
        selectAreas[0].id = "selectArea0Id";
        selectAreas[1].id = "selectArea1Id";
        selectAreas[2].id = "selectArea2Id";
      });

      client.click('#selectArea0Id option[value = ' + appSettings.app_type + ']');
      client.click('#selectArea1Id option[value = ' + appSettings.category + ']');
      client.click('#selectArea2Id option[value = ' + appSettings.rating + ']');
    });

    util.action("Fill in Store Listing information - text", function() {

      client.execute(function(){
        var textAreas = document.getElementsByTagName('textArea');
        textAreas[0].id = "textArea0Id";
        textAreas[1].id = "textArea1Id";
      });

      var shortcutSearch = function(tag, label, count, id){

        return searchForChild(tag, 'innerText', label, count, 'input', id, this._stepClient);
      }

      var pairings = {
        "#textArea0Id": appSettings.subtext,
        "#textArea1Id": appSettings.promo
      };

      pairings["#" + shortcutSearch('p', 'Promo Video', 2, 'promo_vid_child_id')] = appSettings.promo_vid;
      pairings["#" + shortcutSearch('div', 'Website', 1, 'website_text_id')] = appSettings.website;
      pairings["#" + shortcutSearch('div', 'Email', 1, 'email_text_id')] = appSettings.public_email;
      pairings["#" + shortcutSearch('div', 'Phone', 1, 'phone_text_id')] = appSettings.phone;
      
      for (var id in pairings){
        if (!isUndefined(pairings[id])){
          client.setValue(id, pairings[id], function(err, res){});
        }
      } 
    });

    util.action("Fill in Store Listing information - privacy", function() {

      var privacy_id = searchForChild('div', 'innerText' ,'Privacy Policy', 1, 'input', 'privacy_policy_id', client);

      if (appSettings.privacy === null || appSettings.privacy === ""){
        client.execute(function(privacy_id){
          var elem = document.getElementById(privacy_id);
          var checkbox = elem.parentElement.querySelector('input[type="checkbox"]');
          checkbox.click();
        }, [privacy_id]);
      }
      else{
        client.setValue("#"+privacy_id, appSettings.privacy, function(err, res){});
      }
    });

    util.action("Upload graphics and screenshots", function() {

      var waiting_id_list = [];

      var pairings = {
        'Hi-res icon': appSettings.hi_res,
        'Feature Graphic': appSettings.feat_graphic,
        'Promo Graphic': appSettings.promo_graphic
      }

      for (var title in pairings){

        if (pairings[title] === ""){
          break;
        }

        var upload_id = searchForChild('h5', 'innerText', title, 2, 'input', (title+'_online_id').replace(' ', '_'), client);

        client.chooseFile("#" + upload_id, pairings[title], function(err, res){
            
        });

        var waiting_id = "waiting_id_" + waiting_id_list.length;

        client.execute(function(upload_id, waiting_id){
          var input = document.querySelector("#" + upload_id);
          toWatch = input.parentElement.parentElement.children[2];
          toWatch.id = waiting_id;
        }, [upload_id, waiting_id]);

        waiting_id_list[waiting_id_list.length] = waiting_id;
      }

      var splitter = ',';

      var screenshotArray =  {
        "Phone" : appSettings.screenshots_phone.split(splitter),
        "7-inch tablet" : appSettings.screenshots_7.split(splitter),
        "10-inch tablet" : appSettings.screenshots_10.split(splitter),
      }

      var screenshotCount = 0;

      for (type in screenshotArray){
        var currentArray = screenshotArray[type];
        for (i in currentArray){

          var screenshot = currentArray[i];

          if (screenshot === ""){
            break;
          }

          var upload_id = "screenshotID_" + screenshotCount;

          client.execute(function(type, id){

            var divs = document.querySelectorAll('b');
            var correct_div = null; 
            for (var i =0; i <divs.length; i++){ 
              if (divs[i].innerText.trim() === type) {
                correct_div = divs[i];
              }
            }
            var parent = correct_div.parentElement.parentElement;
            var inputs = parent.querySelectorAll('input');
            var input = inputs[inputs.length-1];

            input.id = id;
            console.log('successful uploading id ' + id);

          }, [type, upload_id]);
     
          client.chooseFile("#" + upload_id, screenshot, function(err, res){

          });

          var waiting_id = "waiting_id_" + waiting_id_list.length;

          client.execute(function(upload_id, waiting_id){
            var input = document.querySelector("#" + upload_id);
            toWatch = input.parentElement.parentElement.children[2];
            toWatch.id = waiting_id;
            console.log('successful waiting id ' + waiting_id);
          }, [upload_id, waiting_id]);

          waiting_id_list[waiting_id_list.length] = waiting_id;

          screenshotCount++;
        }
      }
    });
    
    util.action("Click save button", function() {
      client.execute(function(){
        var divs = document.querySelectorAll('div');
        correct_div = null;
        for (var i = 0; i <divs.length; i++){
          var div = divs[i];
        
          if (div.innerHTML.trim() === "Save"){
            correct_div = div;
          }
        }
        correct_div.parentElement.click();

        var interval = window.setInterval(function() {
          var hit = false;

          if (correct_div) {
            for (i in divs) {
              var div = divs[i];
            
              if (div.innerHTML === "Saved"){
                console.log('found');
                div.id = "documentCompletelySaved";
                hit = true;
              }
            }
          }

          if (hit){
            window.clearInterval(interval);
            console.log("done");
          }

        });
      });
    });

    util.action("Go to Pricing & Distribution page", function() {
      client.execute(function(){
        var links =  document.getElementsByTagName('a');
        for (i in links){
          var link = links[i];
          if (link.innerText === "Pricing & Distribution"){
            link.click();
            break;
          }
        }
      });
    });

    util.action("Fill in Pricing & Distribution information - locations", function() {
      client.execute(function(listOfCountries){

        var labels = document.querySelector('h4').parentElement.getElementsByTagName('label');
        for (var i = 0; i <labels.length; i++) {
          var input = labels[i].querySelector('input');

          if (listOfCountries.indexOf(label.innerText) !== -1 ){
            input.checked = true;
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
          for (i in divs){
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
            labels[i].querySelector('input').checked = true;
          }
          else if (optInValues[i] === false){
            labels[i].querySelector('input').checked = false; 
          }
        }
      }, [ [appSettings.marketing_opt_out, appSettings.content_guidelines, appSettings.us_export_laws] ]);
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

  var runAction = function(actionName) {
    var action = _actions[actionName];
    if (action) {
        logActionStart(actionName);
        try {
            action();
            logActionComplete(actionName);
        } catch (ex) {
            _stepClient.getSource(function(err,res){
                dieFromException(res, ex, {action: actionName});
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
      console.log(err);
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
