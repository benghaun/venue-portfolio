var description = document.getElementById('user-desc');
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
function editDescription(currentDesc){
    currentDesc = jQuery('<textarea/>').html(currentDesc).text();
    console.log(currentDesc)
	var edit = document.getElementById('edit-user-desc');
	edit.style.display = 'none';
	description.innerHTML = '';
	var new_desc = document.createElement('textarea');
	new_desc.type = "textarea";
    new_desc.maxLength = 200;
	new_desc.className = "desc-input";
	new_desc.value = currentDesc;
	description.appendChild(new_desc);
	new_desc.select();
    new_desc.onkeypress = function(e){
         if (!e) e = window.event;
         var keyCode = e.keyCode || e.which;
         if (keyCode == '13'){
             var xhr = new XMLHttpRequest();
             xhr.open("POST", "/profile/edit_about/");
             var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
             xhr.setRequestHeader('X-CSRFToken', csrftoken);
             var postData = new FormData();
             new_desc_value = new_desc.value
             escaped_new_desc_value = jQuery('<div/>').text(new_desc.value).html().replaceAll("'", "&#39;");
             escaped_amp_value = escaped_new_desc_value.replaceAll("&", "&amp;")
             postData.append('about_text', new_desc_value);
             xhr.onreadystatechange = function() {
                 if(xhr.readyState === 4){
                     if(xhr.status === 200 || xhr.status === 204){
                         description.innerHTML = escaped_new_desc_value + `<div class="edit" id="edit-user-desc" style="background-image: url('/static/edit.png')" onclick="editDescription('` + escaped_amp_value + `'  )"></div>`;
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
function insertSpaces(s){
    return s.split('').join(' ');
}
function editLayout(username){
    //change edit button
    var edit = document.getElementById('edit-layout');
    edit.style = `background-image: url('/static/tick.png')`;
    edit.onclick = function(){
        var edit = document.getElementById('edit-layout');
        edit.style = `background-image: url('/static/edit.png')`;
        restoreLayout(username);
    };
    //change category names
    var cat_names = document.getElementsByClassName('cat-name');
    var cat_names = Array.prototype.slice.call(cat_names);
    var vert_cat_names = document.getElementsByClassName('cat-name-vert');
    var vert_cat_names = Array.prototype.slice.call(vert_cat_names);
    cat_names.push.apply(cat_names, vert_cat_names);
    for(var i=0; i<cat_names.length; i++){
        var anchor = cat_names[i].parentNode.parentNode;
        anchor.style = "pointer-events: none; cursor: default;";
        anchor.onclick = function() {return false;}
        // currentCat = jQuery('<textarea/>').html(currentCat).text();
        currentCat = cat_names[i].innerHTML;
        currentCat = jQuery('<textarea/>').html(currentCat).text();
        cat_names[i].innerHTML = '';
        if (cat_names[i].className === 'cat-name-vert'){
            var new_cat = document.createElement('textarea');
            new_cat.type = "text";
            new_cat.value = currentCat;
            new_cat.maxLength = 30;
            new_cat.className = "cat-input-vert";
            new_cat.style = "pointer-events: auto;"
            cat_names[i].appendChild(new_cat);
            new_cat.select();
        }
        else{
            var new_cat = document.createElement('input');
            new_cat.type = "text";
            new_cat.value = currentCat;
            new_cat.maxLength = 30;
            new_cat.className = "cat-input";
            new_cat.style = "pointer-events: auto;"
            cat_names[i].appendChild(new_cat);
            new_cat.select();
        }
    }


    var cat_images = document.getElementsByClassName('');
}

function restoreLayout(username){
    var edit = document.getElementById('edit-layout');
    edit.onclick = function(){editLayout(username)}
    var cat_names = document.getElementsByClassName('cat-name');
    var cat_names = Array.prototype.slice.call(cat_names);
    var vert_cat_names = document.getElementsByClassName('cat-name-vert');
    var vert_cat_names = Array.prototype.slice.call(vert_cat_names);
    cat_names.push.apply(cat_names, vert_cat_names);
    newCatData = {}
    for(var i=0; i<cat_names.length; i++){
        var anchor = cat_names[i].parentNode.parentNode;
        anchor.style = "";
        anchor.onclick = function() {return true;}
        // currentCat = jQuery('<textarea/>').html(currentCat).text();
        newCat = cat_names[i].childNodes[0].value.replaceAll(" ", "");
        escapedNewCat = jQuery('<div/>').text(newCat).html().replaceAll("'", "&#39;");
        newCatData[cat_names[i].id] = {'tag': newCat.toLowerCase()}
        anchor.href = "/profile/" + username + "/" + newCat.toLowerCase() + "/";
        if(cat_names[i].className === 'cat-name-vert'){
            cat_names[i].innerHTML = insertSpaces(escapedNewCat).toUpperCase();
        }
        else{
            cat_names[i].innerHTML = escapedNewCat.toUpperCase();
        }
    }
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/profile/edit_featured/")
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    var postData = new FormData();
    postData.append("data", JSON.stringify(newCatData));
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4){
            if (xhr.status === 200 || xhr.status == 204){

            }
            else {
                alert('update failed')
            }
        }
    }
    xhr.send(postData)
}