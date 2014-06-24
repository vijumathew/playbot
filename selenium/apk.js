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
    apk_path: "/Users/clayallsopp/Projects/Apptory/playbot/test-release.apk",
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
client.chooseFile("#" + specialId, appSettings.apk_path, function(err, res) {

});
// client.click("#correct_div");

client.waitFor("#zzz", TIMEOUT * 10, function(err, res) {

});

client.end();
