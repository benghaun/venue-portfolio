var description = document.getElementById('cat-intro');
// var selected_img = document.createElement("div");
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
function editDescription(currentDesc, tag){
    currentDesc = jQuery('<textarea/>').html(currentDesc).text();
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
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/profile/edit_desc/");
            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
            var postData = new FormData();
            new_desc_value = new_desc.value
            escaped_new_desc_value = jQuery('<div/>').text(new_desc.value).html().replaceAll("'", "&#39;");
            escaped_amp_value = escaped_new_desc_value.replace("&", "&amp;")
            postData.append('description', new_desc_value);
            postData.append('tag', tag);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4){
                    if(xhr.status === 200 || xhr.status === 204){
                        description.innerHTML = escaped_new_desc_value + `<div class="edit" id="edit-desc" style="background-image: url('/static/edit.png')" onclick="editDescription('` + escaped_amp_value + `', '` + tag + `')"></div>`;
                        edit.style.display = 'block';
                    }
                    else{
                        alert("Description update failed");
                    }
                }
            };
            xhr.send(postData);
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
    var toRemove = image.parentNode.parentNode.parentNode;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/view/delete_image/");
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    var postData = new FormData();
    postData.append('key', toRemove.id);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status === 200 || xhr.status === 204){
                var carouselId = "carousel-".concat(toRemove.id)
                toRemove.parentNode.removeChild(toRemove);
                console.log(carouselId);
                var toRemoveCarousel = document.getElementById(carouselId);
                toRemoveCarousel.parentNode.removeChild(toRemoveCarousel);
            }
            else{
                alert("Delete failed");
            }
        }
    };
    xhr.send(postData);
}