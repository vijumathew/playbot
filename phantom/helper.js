function searchFor(tag, attribute, match, nested, id){
	return elementId = this.evaluate(function(tag, attribute, match, nested, id) {
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
	    return correct_element.id;
	}, tag, attribute, match, nested, id);
}

function updateChildID(parentID, childTag, childID){
	return elementId = this.evaluate(function(parentID, childTag, childID){
		
		var child = document.getElementById(parentID).querySelector(childTag);
		
		if (child.id === "") {
			child.id = childID;
		}

		return child.id;

	}, parentID, childTag, childID);
}

var hi_res_parent = searchFor('h5', 'innerText', 'Hi-res icon', 2, 'hi_res_parent');
var hi_res_id = updateChildID(hi_res_parent, 'input', 'hi_res_child_id');

var feature_graphic_parent = searchFor('h5', 'innerText', 'Feature Graphic', 2, 'feature_graphic_parent');
var feat_graph_id = updateChildID(feature_graphic_parent, 'input', 'feat_graphic_child_id');

var promo_graph_parent = searchFor('h5', 'innerText', 'Promo Graphic', 2, 'promo_graph_parent');
var promo_graph_id = updateChildID(promo_graph_parent, 'input', 'promo_graphic_child_id');

var promo_video_url_parent = searchFor('p', 'innerText', 'Promo Video', 2, 'promo_video_url_parent');
var promo_video_id = updateChildID(promo_video_url_parent, 'input', 'promo_vid_child_id');

var website_parent = searchFor('div', 'innerText', 'Website', 1, 'website_parent');
var website_id = updateChildID(website_parent, 'input', 'website_text_id');

var email_parent = searchFor('div', 'innerText', 'Email', 1, 'email_parent');
var email_id = updateChildID(email_parent, 'input', 'email_text_id');

var email_parent = searchFor('div', 'innerText', 'Email', 1, 'email_parent');
var email_id = updateChildID(email_parent, 'input', 'email_text_id');

var phone_parent = searchFor('div', 'innerText', 'Phone', 1, 'phone_parent');
var phone_id = updateChildID(phone_parent, 'input', 'phone_text_id');

var privacy_policy = searchFor('div', 'innerText' ,'Privacy Policy', 1, 'privacy_policy_parent');
var privacy_id = updateChildID(privacy_policy, 'input' , 'privacy_policy_id');



//screenshots
var screenshotArray = {
	"Phone" : [],
	"7-inch tablet" : [],
	"10-inch tablet" : []
}

var screenShotCount = 0;
for (type in screenshotArray){
	var currentArray = screenshotArray[type];
	for (i in currentArray){
		var	screenshot = currentArray[i];
		var id = getScreenshotID(type, screenShotCount);
		this.uploadFile("", id);
		screenShotCount++;
	}
}

function getScreenshotID(type, count) {
	return id = this.evaluate(function(type, count){
	    var divs = document.querySelectorAll('b');
	    var correct_div = null; 
	    for (i in divs){ 
	        if (divs[i].innerText === type) {
	            correct_div = divs[i];
	        }
	    }
	    var parent = correct_div.parentElement.parentElement.parentElement.children[type];
	    var inputs = parent.querySelectorAll('input');
	    var input = inputs[inputs.length-1];

	    input.id = "screenshotMagic" + count;
	    return input.id;

	}, type, count);
}
