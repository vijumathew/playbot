var casper = require('casper', 'webpage').create({
    verbose: true,
    logLevel: 'error'
});
casper.userAgent('User-Agent    Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4');

/*
casper.on('remote.message', function(message) {
    this.echo('remote message caught: ' + message);
});
casper.on('resource.error', function(resourceError) {
    console.log("ERROR:");
  console.log(JSON.stringify(resourceError));

});

casper.options.onResourceRequested = function(C, requestData, request) {
    console.log("REQUESTED:");
  console.log(JSON.stringify(requestData));
  };
casper.options.onResourceReceived = function(C, response) {
    console.log("RECEIVED:");
  console.log(JSON.stringify(response));
};
*/


var appSettings = {
    email: 'email@example.com',
    password: 'xxxx',
    name: "omg this apk tho",
    apk_path: "/home/viju/Projects/playbot/displayTester-release.apk",
    subtext: "description",
    promo: "promo",
    category: "APPLICATION",
    subcategory: "SOCIAL",
    rating: "SUITABLE_FOR_ALL",
    locations: ["SELECT ALL COUNTRIES"],
    optInValues: ["0"]
};

var XL_TIMEOUT = 50 * 1000;

var apkFileName = appSettings.apk_path.split("/");
apkFileName = apkFileName[apkFileName.length - 1];

// Login
casper.start('http://play.google.com/apps/publish', function() {
    this.fill('form#gaia_loginform', {
        'Email':appSettings.email,
        'Passwd':appSettings.password
    }, true);
});


casper.then(function(){
    var elementId;
    this.waitForText('App Name', function(){

        elementId = this.evaluate(function() {
            var spans = document.getElementsByTagName('span');
            correct_span = null;
            for(var i = 0; i < spans.length; i++) {
                var span = spans[i];
                if (span.innerHTML.trim() === "Add new application") {
                    correct_span = span;
                }
            }
            return correct_span.parentElement.parentElement.id;
        });
        
        this.click("button#" + elementId);
    }, function(){} , XL_TIMEOUT);
});

casper.then(function(){
    this.waitForText("Default language", function(){
        this.evaluate(function(appName) {
            var input = document.querySelector(".popupContent .gwt-TextBox");
            input.value = appName;
        }, appSettings.name);

        var elementId = this.evaluate(function(){
            var divs = document.getElementsByTagName('div');
            correct_div = null;
            for (var i = 0; i <divs.length; i++){
                var div = divs[i];
                if (div.innerHTML.trim() === "Upload APK"){
                    correct_div = div;
                }
            }
            return correct_div.parentElement.id;
        });
        this.click("button#" + elementId);
    }, function(){} , XL_TIMEOUT);
});

casper.then(function(){
    this.waitForText("Alpha Testing", function(){
        var elementId = this.evaluate(function(){
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

            return correct_div.parentElement.id;
        });

        this.click("button#" + elementId);

    }, function(){}, XL_TIMEOUT);
});


    var specialId = "fileInputIdSecretString";

// inside the modal
casper.then(function(){

    this.waitFor(function() {
        return this.evaluate(function(specialId){
            console.log('buts');
            var divs = document.getElementsByTagName('div');
            correct_div = null;
            for (var i = 0; i <divs.length; i++){
                var div = divs[i];
                if (div.innerHTML.trim() === "Browse files"){
                    correct_div = div;
                }
            }

            var anyHit = false;
            var nodes = correct_div.parentElement.parentElement.children;
            for (var i =0; i <nodes.length; i++){
                var node = nodes[i];
                if (node.tagName==="INPUT"){
                    console.log("hit");
                    node.id= specialId;
                    anyHit = true;
                }
            }
            return anyHit;
        }, specialId);
    }, function() {
        this.echo('uploading');
        this.echo(this.exists("#" + specialId));
        console.log(this.evaluate(function(){
            return document.querySelector("input#fileInputIdSecretString").id;
        }));

        //change the file's url
        this.page.uploadFile("input#" + specialId, appSettings.apk_path);
        this.capture('uploading_started.png');

/*
        // this.click("#" + fileUploadButtonId);
        this.page.onFilePicker = function(oldFile) {
            return appSettings.apk_path;
        };

        this.evaluate(function() {
            var fileUp = document.querySelector("#" + fileUploadButtonId);
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            fileUp.dispatchEvent(ev);
        });
*/
    }, function(){}, XL_TIMEOUT);
    this.waitForText(apkFileName, function() {
        console.log("WOW ITS DONE");
        this.capture("wow.png");
    }, function(){ this.capture("wowfail.png");}, XL_TIMEOUT);
    this.waitForText("uploaded on", function() {
        console.log("done uploading");
        this.capture('superwow.png');
    }, function(){this.capture("superwowfail.png")}, XL_TIMEOUT);
});

//onto store listing
casper.then(function(){
    this.open(this.getCurrentUrl().replace("Apk","MarketListing"));
    this.waitForText("Promo text", function(){
        
        this.evaluate(function(string1, string2){
            var textAreas = document.querySelectorAll('textArea');
            textAreas[0].id = "textArea0Id"
            textAreas[1].id = "textArea1Id"
            
            var selectAreas = document.querySelectorAll('select');
            selectAreas[0].id = "selectArea0Id";
            selectAreas[1].id = "selectArea1Id";
            selectAreas[2].id = "selectArea2Id";
            
        });

        this.sendKeys('textArea#textArea0Id', appSettings.subtext);
        this.sendKeys('textArea#textArea1Id', appSettings.promo);
        
        this.sendKeys('select#selectArea0Id', appSettings.category);
        this.sendKeys('select#selectArea1Id', appSettings.subcategory);
        this.sendKeys('select#selectArea2Id', appSettings.rating);


    /*  var inputFields = this.evaluate(function(){
            toReturn = [];
            var inputAreas = document.querySelectorAll('input');
            for (var i =0; i < inputAreas.length; i++){
                var input = inputAreas[i];
                if (input.className === "file"){
                    input.id = "fileInputIdSecret" + i;
                    toReturn[i]="fileInputIdSecret" + i;
                }
            }
            return toReturn;
            
        });

        for (var i = 0; i < inputFields.length; i++){
            this.page.uploadFile(inputFields[i],"screenshoturl");
        }*/

        this.waitForText("Save", function(){
            var elementId = this.evaluate(function(){
                var divs = document.querySelectorAll('div');
                correct_div = null;
                for (var i = 0; i <divs.length; i++){
                    var div = divs[i];
                
                    if (div.innerHTML.trim() === "Save"){
                        correct_div = div;
                    }
                }   

                return correct_div.parentElement.id;
            });

            this.click("#" + elementId);
        });

    });
});

//pricing now!
casper.then(function(){
    this.open(this.getCurrentUrl().replace("MarketListing","Pricing"));
    
    this.waitForText("Distribute in these countries", function(){
        
        var languageIDs = this.evaluate(function(listOfCountries){
            var toReturn = []

            var labels = document.querySelector('h4').parentElement.getElementsByTagName('label');
            for (var i in labels) {
                var label = labels[i];

                if (listOfCountries.indexOf(label.innerText) !== -1 ){
                    var input = label.querySelector('input');
                    if (input.id=== ""){
                        input.id = "languageToClickID" + i; 
                    }
                    toReturn[toReturn.length] = "#" + input.id;
                }
            }
            return toReturn;
        }, appSettings.locations);
        for (language in languageIDs){
            this.click(languageIDs[language]);
        }

        //opt-in at end
        var optInIDs = this.evaluate(function(toCheck){

            var toReturn = [];
            var field = document.querySelectorAll('fieldset')[2];
            for (i in field.children){
                var child = field.children[i];
                if (child.tagName === "LABEL"){
                    if (toCheck.indexOf(i) !== -1){
                        var input = child.querySelector('input');
                        if (input.id === ""){
                            input.id = "optInButtonToClickID" + child;
                        }
                        toReturn[toReturn.length] = "#" + input.id;
                    }
                }
            }
            return toReturn;

        }, appSettings.optInValues);

        for (optIn in optInIDs){
            this.click(optInIDs[optIn]);
        }

        this.capture('image2.png');

        this.waitForText("Save", function(){
            var elementId = this.evaluate(function(){
                var divs = document.querySelectorAll('div');
                correct_div = null;
                for (var i = 0; i <divs.length; i++){
                    var div = divs[i];
                
                    if (div.innerHTML.trim() === "Save"){
                        correct_div = div;
                    }
                }   

                return correct_div.parentElement.id;
            });

            this.click("#" + elementId);
        });
    });
});

casper.run();
