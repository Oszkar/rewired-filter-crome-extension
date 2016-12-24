$(document).ready(function(){
	console.log("READY");
    $('#gh').on('click', function() {
   		console.log("click");
    	chrome.tabs.create({url: 'https://github.com/Oszkar/rewired-filter-crome-extension/issues'});
    });

    $('#menu').on('click', function() {
   		console.log("click");
    	chrome.tabs.create({url: 'chrome://extensions/'});
    });
});