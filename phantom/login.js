var casper = require('casper', 'webpage').create({
	verbose: true,
	logLevel: 'error'
});

casper.start('http://play.google.com/apps/publish', function() {
	this.fill('form#gaia_loginform', {
		'Email':'email@example.com',
		'Passwd':'xxxx'
	}, true);		
});


casper.then(function(){
	this.echo(this.getTitle() + "1");
	this.waitForText('App Name', function(){
		var elementId = this.evaluate(function() {
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

	}  , function(){} , 50000);
});

casper.then(function(){
	this.echo(this.getTitle() + "2");
	this.waitForText("Default language", function(){
		this.evaluate(function(){
			var inputs = document.getElementsByTagName('input');
			for (var i = 0; i <inputs.length; i++){
				var input = inputs[i];
				if (input.className === "gwt-TextBox"){
					input.value="omg this apk tho";
				}
			}
		});

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

casper.then(function(){
	this.echo(this.getTitle() + "4");
	this.waitForText("Upload new APK to Production", function(){
		var elementId = this.evaluate(function(){
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
					node.id="fileInputIdSecretString";
				}
			}
			return "fileInputIdSecretString";
		});

		this.echo('uploading');
		this.echo(this.exists("#fileInputIdSecretString"));

		//change the file's url
		this.page.uploadFile("input#fileInputIdSecretString","/home/viju/Projects/DisplayTester/displayTester/build/outputs/apk/displayTester-release.apk");

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
			
			var inputAreas = document.querySelectorAll('input');
			
		});




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
});

casper.then(function() {
    this.echo(this.getTitle());
});


casper.run();
