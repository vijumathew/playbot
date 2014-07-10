var _actions = {};

var action = function(description, callback) {
    if (callback === undefined) {    
        //TODO: error logging like applebot
        _actions[description]();
    }
    else {
        _actions[description] = callback;
    }
};

var step = function(description, waitFunction, callback) {
    waitFunction();
    callback();
};


var runScript = function(client, appSettings) {

    var specialId = "fileInputIdSecretString";

    var TIMEOUT = 5 * 1000;

    action("Login", function(){
        client.url('https://play.google.com/apps/publish');
        client.setValue('#Email', appSettings.email, function(err, res) {

        });
        client.setValue('#Passwd', appSettings.password, function(err, res) {

        });
        client.submitForm('form#gaia_loginform', function(err, res) {

        });
    });

    step("Log in to page", function() {

    }, function() {
        action("Login");
    });

    action("Click on Add new app", function() {
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

    step("Wait for login to complete", function() {
        client.waitFor('table tr a', TIMEOUT, function(err, res) {

        });
    }, function() {
            action("Click on Add new app");
    });

    action("Fill in and submit initial app information", function() {
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

    step("Wait for app dialogue", function() {
        client.waitFor(".popupContent fieldset", TIMEOUT, function(err, res) {

        });
    }, function() {
        action("Fill in and submit initial app information");
    });

    action("Go to APK upload", function() {
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

    action("Find APK input element", function() {

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
    
    step("Wait for APK page", function() {
        client.waitFor("div[data-stickyscrolling-placeholder]", TIMEOUT, function(err, res) {

        });
    }, function() {
        action("Go to APK upload");
        action("Find APK input element");
    });

    var upload_id = 'apk_uploading_id';

    action("Upload APK", function() {
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

    step("Wait for APK box", function() {
        client.waitFor("#correct_div", TIMEOUT, function(err, res) {

        });
    }, function() {
        action("Upload APK");
    });

    action("Go to Store Listing page", function() {
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

    step("Wait for APK upload", function() {
        client.waitForVisible('#' + upload_id, TIMEOUT * 10, function(err, res){

        });
    }, function() {
        action("Go to Store Listing page");
    });

    action("Fill in Store Listing information - text and select", function() {

        client.execute(function(){
            var textAreas = document.getElementsByTagName('textArea');
            textAreas[0].id = "textArea0Id";
            textAreas[1].id = "textArea1Id";

            var selectAreas = document.querySelectorAll('select');
            selectAreas[0].id = "selectArea0Id";
            selectAreas[1].id = "selectArea1Id";
            selectAreas[2].id = "selectArea2Id";
        });

        client.setValue("textarea#textArea0Id", appSettings.subtext, function(err, res){

        });


        //OPTIONAL
        client.setValue("textarea#textArea1Id", appSettings.promo, function(err,res){

        });

        client.click('#selectArea0Id option[value = ' + appSettings.app_type + ']');
        client.click('#selectArea1Id option[value = ' + appSettings.category + ']');
        client.click('#selectArea2Id option[value = ' + appSettings.rating + ']');
    });

    action("Fill in Store Listing information - other info", function() {

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

        var promo_video_id = searchForChild('p', 'innerText', 'Promo Video', 2, 'input', 'promo_vid_child_id', client);
        var website_id = searchForChild('div', 'innerText', 'Website', 1, 'input', 'website_text_id', client);
        var email_id = searchForChild('div', 'innerText', 'Email', 1, 'input', 'email_text_id', client);
        var phone_id = searchForChild('div', 'innerText', 'Phone', 1, 'input', 'phone_text_id', client);
        var privacy_id = searchForChild('div', 'innerText' ,'Privacy Policy', 1, 'input', 'privacy_policy_id', client);

        //OPTIONAL
        client.setValue("#"+promo_video_id, appSettings.promo_vid, function(err, res){});
        client.setValue("#"+website_id, appSettings.website, function(err, res){});
        client.setValue("#"+email_id, appSettings.public_email, function(err, res){});
        //OPTIONAL
        client.setValue("#"+phone_id, appSettings.phone, function(err, res){});
        
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

    //when these are blank, how does wait work? what happens? (b/c optional)
    //OPTIONAL -some of the graphics 
    action("Upload screenshots and graphics", function() {

    });


    action("Click save button", function() {
        client.execute(function(){
            var divs = document.querySelectorAll('div');
            correct_div = null;
            for (var i = 0; i <divs.length; i++){
                var div = divs[i];
            
                if (div.innerHTML.trim() === "Save"){
                    correct_div = div;
                }
            }
            correct_div.parentElement.click()
            correct_div.id = "documentSaved";

        });

        client.waitFor("#documentSaved", TIMEOUT, function(err,res){

        });

        client.execute(function(){
            var spans = document.querySelectorAll('span');
            
            for (var i in spans){
                var span = spans[i];

                if (span.innerText === "Your application has been saved."){
                    span.id = "documentCompletelySaved";
                }
            }
        });
    });

    step("Wait for Store Listing page", function() {
        client.waitFor('select', TIMEOUT, function(err, res){

            });
    }, function() {
        action("Fill in Store Listing information - text and select");
        action("Fill in Store Listing information - other info");
        action("Upload screenshots and graphics");
        action("Click save button");
    });

    action("Go to Pricing & Distribution page", function() {
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

    step("Wait for completely saved document", function() {
        client.waitFor("#documentCompletelySaved", TIMEOUT, function(err,res) {
        });
    }, function() {
        action("Go to Pricing & Distribution page");
    });

    action("Fill in Pricing & Distribution information - locations", function() {
        client.execute(function(listOfCountries){
            var toReturn = []

            var labels = document.querySelector('h4').parentElement.getElementsByTagName('label');
            for (var i in labels) {
                var label = labels[i];

                if (listOfCountries.indexOf(label.innerText) !== -1 ){
                    var input = label.querySelector('input');
                    if (input.id=== ""){
                        input.id = "languageToClickID" + i; 
                    }
                    toReturn[toReturn.length] = input.id;
                }
            }
            
            for (language in toReturn){
                var elem = document.getElementById(toReturn[language]);
                elem.click();
            }
        }, [appSettings.locations]);
    });

    action("Fill in Pricing & Distribution information - education", function() {

        //OPTIONAL

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
    
    action("Fill in Pricing & Distribution information - opt in", function() {
        client.execute(function(optInValues){
            toReturn = [];
            var field = document.querySelectorAll('fieldset')[2];
            for (i in field.children){
                var child = field.children[i];
                if (child.tagName === "LABEL"){
                    if (optInValues[i]){
                        var input = child.querySelector('input');
                        if (input.id === ""){
                            input.id = "optInButtonToClickID" + child;
                        }
                        toReturn[toReturn.length] = input.id;
                    }
                }
            }

            for (opt in toReturn){
                var elem = document.getElementById(toReturn[opt]);
                elem.click();
            }
            //OPTIONAL (marketing_opt_out)
        }, [ [appSettings.marketing_opt_out, appSettings.content_guidelines, appSettings.us_export_laws] ]);
    });

    step("Wait for Pricing & Distribution page", function() {
        client.waitFor('colgroup', TIMEOUT, function(err, res){

        });
    }, function() {
        action("Fill in Pricing & Distribution information - locations");
        action("Fill in Pricing & Distribution information - education");
        action("Fill in Pricing & Distribution information - opt in");
        action("Click save button");
    });

    step("Wait for completely saved document", function() {
        client.waitFor("#documentCompletelySaved", TIMEOUT, function(err,res) {

        });
    }, function() {

    });

}

var ScriptRunner = {
    run: function(namespace, action, userOptions) {
        console.log("running " + namespace + ":" + action + " with " + JSON.stringify(userOptions));

        this.startSelenium(function(client) {

            var selenium = require('selenium-standalone');
            var seleniumServer = selenium({stdio: 'pipe'});

            seleniumServer.stdout.on('data', function(output) {
                var val = output.toString().trim();
                console.log(val);
                if(val.indexOf('jetty.jetty.Server')>-1){
                    client = client.init();
                    start();
                }
            });

            seleniumServer.stderr.on('data', function (data) {
              console.log('stderr: ' + data);
            });

            seleniumServer.on('close', function (code) {
              console.log('child process exited with code ' + code);
            });

            function start() {
                runScript(client, userOptions);
            }

        });
    },
    startSelenium: function(callback) {

        var webdriverjs = require('webdriverjs');
        var driverOptions = {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        };
        var client = webdriverjs.remote(driverOptions);

        callback(client);
    }
};

exports = module.exports = ScriptRunner;
