var webdriverjs = require('webdriverjs');

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

function insertScreenshotID(type, id, client) {

    client.execute(function(type, id){
        var divs = document.querySelectorAll('b');
        var correct_div = null; 
        for (i in divs){ 
            if (divs[i].innerText === undefined) {}
            else if (divs[i].innerText.trim() === type) {
                correct_div = divs[i];
            }
        }
        var parent = correct_div.parentElement.parentElement;
        var inputs = parent.querySelectorAll('input');
        var input = inputs[inputs.length-1];

        input.id = id;

    }, [type, id]);

    return id;
}

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
    education: true,
    education_ads: true,
    education_purchases: false,
    marketing_opt_out: true,
    content_guidelines: true,
    us_export_laws: true,
    feat_graphic: "/home/viju/Pictures/app/1024.jpg",
    hi_res: "/home/viju/Pictures/app/512.png",
    promo_graphic: "/home/viju/Pictures/app/180.jpg",
    promo_vid: "https://www.youtube.com/watch?v=Po0cbHFDU-o",
    public_email: "email@example.com",
    phone: "+12088371432",
    website: "http://www.usepropeller.com",
    privacy: "http://www.usepropeller.com",
    screenshots:  {
        "Phone" : ["/home/viju/Pictures/dan.jpg"],
        "7-inch tablet" : ["/home/viju/Pictures/jen.jpg"],
        "10-inch tablet" : ["/home/viju/Pictures/dan.jpg"]
    }
};

var specialId = "fileInputIdSecretString";

var TIMEOUT = 5 * 1000;


var client = webdriverjs.remote(options).init();

client.addCommand("clickSaveButton", function(cb){
    this.execute(function(){
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

    this.waitFor("#documentSaved", TIMEOUT, function(err,res){

    });

    this.execute(function(){
        var spans = document.querySelectorAll('span');
        
        for (var i in spans){
            var span = spans[i];

            if (span.innerText === "Your application has been saved."){
                span.id = "documentCompletelySaved";
            }
        }
    });


    this.waitFor("#documentCompletelySaved", TIMEOUT, function(err,res){
        cb(err,res);
    });

});

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

client.chooseFile("#" + specialId, appSettings.apk_path, function(err, res) {

});

var upload_id = 'apk_uploading_id';

client.execute(function(upload_id){
    var p = document.getElementsByTagName('p');
    for (i in p) { 
        if (p[i].innerText.trim()==="Supported devices") { 
            p[i].parentElement.id = upload_id;
            break;
        } 
    }

}, [upload_id]);

client.waitForVisible('#' + upload_id, TIMEOUT * 10, function(err, res){

});

// client.click("#correct_div");

/*client.waitFor("#zzz", TIMEOUT * 10, function(err, res) {

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


var promo_video_id = searchForChild('p', 'innerText', 'Promo Video', 2, 'input', 'promo_vid_child_id', client);
var website_id = searchForChild('div', 'innerText', 'Website', 1, 'input', 'website_text_id', client);
var email_id = searchForChild('div', 'innerText', 'Email', 1, 'input', 'email_text_id', client);
var phone_id = searchForChild('div', 'innerText', 'Phone', 1, 'input', 'phone_text_id', client);
var privacy_id = searchForChild('div', 'innerText' ,'Privacy Policy', 1, 'input', 'privacy_policy_id', client);

//this needs to be a valid youtube address - any way to check that?
client.setValue("#"+promo_video_id, appSettings.promo_vid, function(err, res){});
client.setValue("#"+website_id, appSettings.website, function(err, res){});
client.setValue("#"+email_id, appSettings.public_email, function(err, res){});
client.setValue("#"+phone_id, appSettings.phone, function(err, res){});
//also privacy checkbox
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

var pairings = {
    'Hi-res icon': appSettings.hi_res,
    'Feature Graphic': appSettings.feat_graphic,
    'Promo Graphic': appSettings.promo_graphic
}

for (var title in pairings){

    var id = searchForChild('h5', 'innerText', title, 2, 'input', (title+'_online_id').replace(' ', '_'), client);

    if (pairings[title] === ""){
        break;
    }

    client.chooseFile("#" + id, pairings[title], function(err, res){

    });
    var waiting_id = id + "_waiting";

    client.execute(function(upload_id, waiting_id){
        var input = document.querySelector('#'+ upload_id);
        toWatch = input.parentElement.parentElement.children[2];
        toWatch.id = waiting_id;
    }, [id, waiting_id]);

    client.waitForVisible('#' + waiting_id, TIMEOUT*10, function(err,res){

    });
}

var screenshotArray = appSettings.screenshots;
var screenshotCount = 0;
for (type in screenshotArray){
    var currentArray = screenshotArray[type];
    for (i in currentArray){

        var screenshot = currentArray[i];

        if (screenshot === ""){
            break;
        }

        var upload_id = insertScreenshotID(type, "screenshotID" + screenshotCount, client);
        var waiting_id = "fileWaitingID";

        client.chooseFile("#" + upload_id, screenshot, function(err, res){
            
        });

        client.execute(function(upload_id, waiting_id){
            var input = document.querySelector("#" + upload_id);
            toWatch = input.parentElement.parentElement.children[2];
            toWatch.id = waiting_id;
        }, [upload_id, waiting_id]);

        client.waitForVisible('#' + waiting_id, TIMEOUT*10, function(err,res){
            client.execute(function(waiting_id){
                var toChange = document.querySelector("#" + waiting_id);
                toChange.id = "";
            }, waiting_id);
        });

        screenshotCount++;
    }
}

client.clickSaveButton(function(err, res){

});

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
}, [appSettings.locations]);


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

}, [ [appSettings.marketing_opt_out, appSettings.content_guidelines, appSettings.us_export_laws] ]);

client.clickSaveButton(function(err, res){
    
});

client.end();
