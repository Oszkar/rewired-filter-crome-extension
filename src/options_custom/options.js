function loadOptions() {
	console.log("Loading local filter options");
	var users = localStorage["filteredusers"];
	console.log("Loaded user list: " + users);
	document.getElementById("usernames").value = users;
}

function saveOptions() {
	var list = document.getElementById("usernames").value;
	console.log("Saving local filter options: " + list);	
	localStorage["filteredusers"] = list;
}

function eraseOptions() {
	console.log("Erasing local filter options (back to default)")
	localStorage.removeItem("filteredusers");
	location.reload();
}

function init() {
	loadOptions();
	document.getElementById("saveButton").addEventListener("click", saveOptions);
	document.getElementById("eraseButton").addEventListener("click", eraseOptions);
}

window.onload = init;