var description = document.getElementById('user-desc');

function editDescription(currentDesc){
    currentDesc = jQuery('<textarea/>').html(currentDesc).text();
	var edit = document.getElementById('edit-user-desc');
	edit.style.display = 'none';
	description.innerHTML = '';
	var new_desc = document.createElement('textarea');
	new_desc.type = "textarea";
	new_desc.value = currentDesc;
    new_desc.maxLength = 300;
	new_desc.className = "desc-input";
	description.appendChild(new_desc);
	new_desc.select();
	// new_desc.onkeypress = function(e){
 //        if (!e) e = window.event;
 //        var keyCode = e.keyCode || e.which;
 //        if (keyCode == '13'){
 //            // Enter pressed
 //            var xhr = new XMLHttpRequest();
 //            xhr.open("POST", "/profile/edit_desc/");
 //            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
 //            xhr.setRequestHeader('X-CSRFToken', csrftoken);
 //            var postData = new FormData();
 //            new_desc_value = new_desc.value
 //            escaped_new_desc_value = jQuery('<div/>').text(new_desc.value).html().replace("'", "&#39;");
 //            escaped_amp_value = escaped_new_desc_value.replace("&", "&amp;")
 //            postData.append('description', new_desc_value);
 //            postData.append('tag', tag);
 //            xhr.onreadystatechange = function() {
 //                if(xhr.readyState === 4){
 //                    if(xhr.status === 200 || xhr.status === 204){
 //                        description.innerHTML = escaped_new_desc_value + `<div class="edit" id="edit-desc" style="background-image: url('/static/edit.png')" onclick="editDescription('` + escaped_amp_value + `', '` + tag + `')"></div>`;
 //                        edit.style.display = 'block';
 //                    }
 //                    else{
 //                        alert("Description update failed");
 //                    }
 //                }
 //            };
 //            xhr.send(postData);
 //            return false;
 //        }
 //  }
}

function editLayout(){
    //change edit button
    var edit = document.getElementById('edit-layout');
    edit.style = `background-image: url('/static/tick.png')`;
    edit.onclick = function(){
        var edit = document.getElementById('edit-layout');
        edit.style = `background-image: url('/static/edit.png')`;
        edit.onclick = function(){editLayout();};
    };
    //change category names
    var cat_names = document.getElementsByClassName('cat-name');
    for(var i=0; i<cat_names.length; i++){
        // currentCat = jQuery('<textarea/>').html(currentCat).text();
        currentCat = cat_names[i].innerHTML;
        cat_names[i].innerHTML = '';
        var new_cat = document.createElement('input');
        new_cat.type = "text";
        new_cat.value = currentCat;
        new_cat.maxLength = 30;
        new_cat.className = "cat-input";
        cat_names[i].appendChild(new_cat);
        new_cat.select();
    }


    var cat_images = document.getElementsByClassName('');
}