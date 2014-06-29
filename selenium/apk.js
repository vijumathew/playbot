function save(client){
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
    })


    client.waitFor("#documentCompletelySaved", TIMEOUT, function(err,res){

    });
};

function searchFor(tag, attribute, match, nested, id, client){
    client.execute(function(tag, attribute, match, nested, id) {
        var elements = document.querySelectorAll(tag);
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
        correct_element.id = id;

    }, [tag, attribute, match, nested, id]);
    
    return id;
}

function updateChildID(parentID, childTag, childID, client){
    
    client.execute(function(parentID, childTag, childID){
        
        var child = document.getElementById(parentID).querySelector(childTag);
        
        child.id = childID;

    }, [parentID, childTag, childID]);

    return childID;
}

var webdriverjs = require('../node_modules/webdriverjs/index');
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};


var appSettings = {
    email: 'email@example.com',
    password: 'xxxx',
    name: "test app",
    apk_path: "/home/viju/Projects/playbot/displayTester-release.apk",
    subtext: "description",
    promo: "promo",
    category: "APPLICATION",
    subcategory: "SOCIAL",
    rating: "SUITABLE_FOR_ALL",
    locations: ["SELECT ALL COUNTRIES"],
    optInValues: ["0"]
};

var specialId = "fileInputIdSecretString";

var TIMEOUT = 5 * 1000;


var client = webdriverjs.remote(options).init();

client.url('https://play.google.com/apps/publish');
client.setValue('#Email', appSettings.email, function(err, res) {

});
client.setValue('#Passwd', appSettings.password, function(err, res) {

});
client.submitForm('form#gaia_loginform', function(err, res) {

});

client.url("https://play.google.com/apps/publish");
client.waitFor('table tr a', TIMEOUT, function(err, res) {

});
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

client.waitFor(".popupContent fieldset", TIMEOUT, function(err, res) {

});
client.setValue(".popupContent .gwt-TextBox", appSettings.name, function(err, res) {

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

client.waitFor("div[data-stickyscrolling-placeholder]", TIMEOUT, function(err, res) {

});
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
client.waitFor("#correct_div", TIMEOUT, function(err, res) {

});
/*
client.chooseFile("#" + specialId, appSettings.apk_path, function(err, res) {

});
// client.click("#correct_div");

client.waitFor("#zzz", TIMEOUT * 10, function(err, res) {

});*/

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

client.waitFor('select', TIMEOUT, function(err, res){

});

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

client.setValue("textarea#textArea1Id", appSettings.promo, function(err,res){

});

client.click('#selectArea0Id option[value = ' + appSettings.category + ']');
client.click('#selectArea1Id option[value = ' + appSettings.subcategory + ']');
client.click('#selectArea2Id option[value = ' + appSettings.rating + ']');

var hi_res_parent = searchFor('h5', 'innerText', 'Hi-res icon', 2, 'hi_res_parent', client);
var hi_res_id = updateChildID(hi_res_parent, 'input', 'hi_res_child_id', client);

var feature_graphic_parent = searchFor('h5', 'innerText', 'Feature Graphic', 2, 'feature_graphic_parent', client);
var feat_graph_id = updateChildID(feature_graphic_parent, 'input', 'feat_graphic_child_id', client);

var promo_graph_parent = searchFor('h5', 'innerText', 'Promo Graphic', 2, 'promo_graph_parent', client);
var promo_graph_id = updateChildID(promo_graph_parent, 'input', 'promo_graphic_child_id', client);

client.chooseFile("#"+ hi_res_id, '/home/viju/Pictures/app/512.png', function(err,res){
    console.log(err);
    console.log(res);
});

client.chooseFile("#"+ feat_graph_id, '/home/viju/Pictures/app/1024.jpg', function(err,res){

});

client.chooseFile("#"+ promo_graph_id, '/home/viju/Pictures/app/180.jpg', function(err,res){

});



var promo_video_url_parent = searchFor('p', 'innerText', 'Promo Video', 2, 'promo_video_url_parent', client);
var promo_video_id = updateChildID(promo_video_url_parent, 'input', 'promo_vid_child_id', client);

var website_parent = searchFor('div', 'innerText', 'Website', 1, 'website_parent', client);
var website_id = updateChildID(website_parent, 'input', 'website_text_id', client);

var email_parent = searchFor('div', 'innerText', 'Email', 1, 'email_parent', client);
var email_id = updateChildID(email_parent, 'input', 'email_text_id', client);

var email_parent = searchFor('div', 'innerText', 'Email', 1, 'email_parent', client);
var email_id = updateChildID(email_parent, 'input', 'email_text_id', client);

var phone_parent = searchFor('div', 'innerText', 'Phone', 1, 'phone_parent', client);
var phone_id = updateChildID(phone_parent, 'input', 'phone_text_id', client);

var privacy_policy = searchFor('div', 'innerText' ,'Privacy Policy', 1, 'privacy_policy_parent', client);
var privacy_id = updateChildID(privacy_policy, 'input' , 'privacy_policy_id', client);


//this needs to be a valid youtube address - any way to check that?
client.setValue("#"+promo_video_id, "promo_vid", function(err, res){});
client.setValue("#"+website_id, "website", function(err, res){});
client.setValue("#"+email_id, "email", function(err, res){});
client.setValue("#"+phone_id, "phone", function(err, res){});
//also privacy checkbox
client.setValue("#"+privacy_id, "privacy", function(err, res){});

save(client);

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

client.waitFor('colgroup', TIMEOUT, function(err, res){

});

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
}, appSettings.locations);

client.execute(function(toCheck){
    toReturn = [];
    var field = document.querySelectorAll('fieldset')[2];
    for (i in field.children){
        var child = field.children[i];
        if (child.tagName === "LABEL"){
            if (toCheck.indexOf(i) !== -1){
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

}, appSettings.optInValues);

save(client);

client.end();
