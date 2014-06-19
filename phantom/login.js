var casper = require('casper', 'webpage').create({
    verbose: true,
    logLevel: 'error'
});

var appSettings = {
    email: 'email@example.com',
    password: 'xxxx',
    name: "omg this apk tho",
    apk_path: "/Users/clayallsopp/Projects/Apptory/playbot/displayTester-release.apk"
};

var apkFileName = apk_path.split("/");
apkFileName = apkFileName[apkFileName.length - 1];

// Login
casper.start('http://play.google.com/apps/publish', function() {
    this.fill('form#gaia_loginform', {
        'Email':appSettings.email,
        'Passwd':appSettings.password
    }, true);
});


casper.then(function(){
    this.echo(this.getTitle() + "1");
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
    }, function(){} , 50000);
});

casper.then(function(){
    this.echo(this.getTitle() + "2");
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
    });
});

casper.then(function(){
    this.echo(this.getTitle() + "3");
    this.waitForText("Alpha Testing", function(){
        this.echo(this.getTitle());
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

    }, function(){}, 50000);
});

// inside the modal
casper.then(function(){
    this.echo(this.getTitle() + "4");
    this.waitUntilVisible(".popupContent", function(){
        var elementId = this.evaluate(function(){
            console.log('buts');
            var divs = document.getElementsByTagName('div');
            correct_div = null;
            for (var i = 0; i <divs.length; i++){
                var div = divs[i];
                if (div.innerHTML.trim() === "Browse files"){
                    correct_div = div;
                }
            }

            var nodes = correct_div.parentElement.parentElement.children;
            for (var i =0; i <nodes.length; i++){
                var node = nodes[i];
                if (node.tagName==="INPUT"){
                    console.log("hit");
                    node.id="fileInputIdSecretString";
                }
            }
            return "fileInputIdSecretString";
        });

        this.echo('uploading');
        this.echo(this.exists("#fileInputIdSecretString"));

        //change the file's url
        this.page.uploadFile("input#fileInputIdSecretString", appSettings.apk_path);
    });
    this.waitForText(apkFileName, function() {
        console.log("WOW ITS DONE");
    });
    this.waitForText("uploaded on", function() {
        console.log("done uploading");
    });
});

//this is for checking to see if it was uploaded
/* 
casper.then(function(){
    this.capture("screenshot.png")
    this.waitForText("Current APK", function(){
        this.echo("found");
    }, function(){
        this.echo("not found");
    }, 100000);
});*/

//onto store listing
casper.then(function(){
    this.open(this.getCurrentUrl().replace("Apk","MarketListing"));
    this.waitForText("Promo text", function(){
        var string1 = "description";
        var string2 = "promo";
        this.evaluate(function(string1, string2){
            var textAreas = document.querySelectorAll('textArea');
            textAreas[0].value = string1;
            textAreas[1].value = string2;
            
            var selectAreas = document.querySelectorAll('select');
            selectAreas[0].value = "APPLICATION";
            selectAreas[1].value = "SOCIAL";
            selectAreas[2].value = "SUITABLE_FOR_ALL";
            
        });

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


        //save
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

        this.click("button#" + elementId);

        //rest of input fields
    });


});

//pricing now!
casper.then(function(){
    this.thenOpen(this.getCurrentUrl().replace("MarketListing","Pricing"));
    this.echo(this.getCurrentUrl());
    var listOfCountries = ['Select all countries']
    var langageIDs = this.evaluate(function(){
        var toReturn = []
        var labels = document.querySelectorAll('label');
        for (var i in labels) {
            var label = labels[i];

            if (listOfCountries.indexOf(label.innerText.trim()) !== -1 ){
                var input = label.querySelector('input');
                if (input.id=== ""){
                    input.id = "languageToClickID" + i; 
                }
                toReturn[toReturn.length] = "#" + input.id;
            }
        }
        return toReturn;
    });
    for (language in langageIDs){
        this.click(languageIDs[language]);
    }

    //opt-in at end
    var optInIDs = this.evaluate(function(){
        var toCheck = ["Marketing opt-out   Do not promote my application except in Google Play and in any Google-owned online or mobile properties. I understand that any changes to this preference may take sixty days to take effect."];
        var toReturn = [];
        var field = document.querySelectorAll('fieldset')[2];
        for (child in field.children){
            if (child.tagName === "LABEL"){
                if (toCheck.indexOf(child.innerText) !== -1){
                    var input = child.querySelector('input');
                    if (input.id === ""){
                        input.id = "optInButtonToClickID" + child;
                    }
                    toReturn[toReturn.length] = "#" + input.id;
                }
            }
        }
        return toReturn;
    });
    for (optIn in optInIDs){
        this.click(optInIDs[optIn]);
    }

    //save function
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

    this.click("button#" + elementId);

});

casper.then(function() {
    this.echo(this.getTitle());
});


casper.run();
