var description = document.getElementById('cat-intro');
// var selected_img = document.createElement("div");

function editDescription(currentDesc){
	var edit = document.getElementById('edit-desc');
	edit.style.display = 'none';
	description.innerHTML = '';
	var new_desc = document.createElement('input');
	new_desc.type = "textarea";
	new_desc.value = currentDesc;
	new_desc.className = "desc-input";
	description.appendChild(new_desc);
	new_desc.select();
	new_desc.onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      // Enter pressed
      description.innerHTML = new_desc.value + `<div class="edit" id="edit-desc" style="background-image: url('/static/edit.png')" onclick="editDescription('` + new_desc.value + `')"></div>`;
      edit.style.display = 'block';
      return false;
    }
  }
}

function editImages(){
	//change edit button
	var edit = document.getElementById('edit-img');
	edit.style = `background-image: url('/static/tick.png')`;
	edit.onclick = function(){
		var edit = document.getElementById('edit-img');
		edit.style = `background-image: url('/static/edit.png')`;
		var images = document.getElementsByClassName('small-thumb');
		for(var i=0; i<images.length; i++){
			console.log(images[i]);
			images[i].removeChild(images[i].lastChild);
		}
		edit.onclick = function(){editImages();};
	};
	// overlay delete icons
	var images = document.getElementsByClassName('small-thumb');
	for(var i=0; i<images.length; i++){
		var del = document.createElement('div');
		del.className = "del";
		selected_img = images[i];
		var del_img = document.createElement('div');
		del_img.onclick = function(e){
			e = e || window.event;
	    	var targ = e.target || e.srcElement;
	    	if (targ.nodeType == 3) targ = targ.parentNode; // defeat Safari bug
				deleteImage(targ);
		};
		del_img.className = `del-img`;
		del_img.style = `background-image: url('/static/delete.png')`;
		var del_text = document.createElement('span');
		del_text.onclick = function(e){
			e = e || window.event;
	    	var targ = e.target || e.srcElement;
	    	if (targ.nodeType == 3) targ = targ.parentNode; // defeat Safari bug
				deleteImage(targ);
		};
		del_text.className = `del-text`;
		del_text.innerHTML = `Delete`;
		images[i].appendChild(del);
		del.appendChild(del_img);
		del.appendChild(del_text);
	}
}

function deleteImage(image){
	image.parentNode.parentNode.parentNode.parentNode.removeChild(image.parentNode.parentNode.parentNode);
}