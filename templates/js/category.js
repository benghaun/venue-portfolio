var description = document.getElementById('cat-intro');

function editDescription(currentDesc){
	var new_desc = document.createElement('input')
	new_desc.type = "text";
	new_desc.value = currentDesc;
	new_desc.className = "desc-input";
	description.appendChild(new_desc);
	new_desc.select();
}