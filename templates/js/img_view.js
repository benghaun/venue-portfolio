$('#carousel-custom').on('slid.bs.carousel', function (e) {
    var index = $(e.target).find(".active").html();

    document.getElementById('selectedId').innerHTML = e.relatedTarget.getAttribute("data-img")
    document.getElementById('selectedTitle').innerHTML = e.relatedTarget.id
    document.getElementById('img-desc').innerHTML = e.relatedTarget.getAttribute("data-desc")
    document.getElementById('img-title').innerHTML = "- " + e.relatedTarget.id.toUpperCase() + " -"
    liked = e.relatedTarget.getAttribute("data-liked") === "True"
    var like_btn = document.getElementById('like');
    var like_text = document.getElementById('like-text');
    var like_img = document.getElementById('like-img');
    if (!liked){
        like_btn.className = 'like-btn';
        like_text.innerHTML = 'Like';
        like_img.style = `background-image: url('/static/like.png')`;
    }
    else{
        like_btn.className = 'liked-btn';
        like_text.innerHTML = 'Liked';
        like_img.style = `background-image: url('/static/tick_boxless.png')`;
    }
});

var title = document.getElementById('img-title');
var description = document.getElementById('img-desc');

function editTitle(currentTitle){
    currentTitle = jQuery('<textarea/>').html(currentTitle).text();
	var edit = document.getElementById('edit-title');
	edit.style.display = 'none';
	title.innerHTML = '';
	var new_desc = document.createElement('input');
	new_desc.type = "text";
	new_desc.value = currentTitle;
	new_desc.className = "title-input";
	title.appendChild(new_desc);
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
 //            escaped_new_desc_value = jQuery('<div/>').text(new_desc.value).html().replaceAll("'", "&#39;");
 //            escaped_amp_value = escaped_new_desc_value.replace("&", "&amp;")
 //            postData.append('description', new_desc_value);
 //            postData.append('tag', tag);
 //            xhr.onreadystatechange = function() {
 //                if(xhr.readyState === 4){
 //                    if(xhr.status === 200 || xhr.status === 204){
 //                        title.innerHTML = escaped_new_desc_value + `<div class="edit" id="edit-desc" style="background-image: url('/static/edit.png')" onclick="editDescription('` + escaped_amp_value + `', '` + tag + `')"></div>`;
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

function editDescription(currentDesc, tag){
    currentDesc = jQuery('<textarea/>').html(currentDesc).text();
	var edit = document.getElementById('edit-desc');
	edit.style.display = 'none';
	description.innerHTML = '';
	var new_desc = document.createElement('textarea');
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

function removeTag(tag){
	var tag_element = document.getElementById(tag);
	tag_element.parentNode.removeChild(tag_element);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/profile/del_tag/");
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    var postData = new FormData();
    postData.append("imageid", document.getElementById('selectedId').innerHTML)
    postData.append('tag', tag)
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status === 200 || xhr.status === 204){

            }
            else{
                alert("Delete failed");
            }
        }
    };
    xhr.send(postData);
}

function addTag(){
    //adds tag
    var add_tag = document.getElementById("add-tag");
    parent = add_tag.parentNode;

    //remove edit input
    parent.removeChild(add_tag);
    var tag_input = document.createElement("input");
    tag_input.id = "tag-input";
    tag_input.type = "text";
    tag_input.className = "tag-input";
    parent.appendChild(tag_input);
    tag_input.select();
    var submit_tag = document.createElement("div");
    submit_tag.id = 'enter';
    submit_tag.className = "enter";
    submit_tag.style = `background-image: url('/static/enter.png')`;
    submit_tag.onclick = function(){submitTag();};
    parent.appendChild(submit_tag);
    tag_input.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
            // Enter pressed
            submitTag();
        }
    }
}

function submitTag(){
    var tag_input = document.getElementById("tag-input");
    var parent = tag_input.parentNode;
    //remove edit input
    parent.removeChild(tag_input);
    var enter = document.getElementById("enter");
    parent.removeChild(enter);
    //add new tag
    var new_tag = document.createElement("li");
    new_tag.className = "img-tag";
    new_tag.id = tag_input.value;
    new_tag.innerHTML = `<span onclick="" style="cursor: pointer;" class="tag-text">` 
    + tag_input.value + `</span>
    <div class="cross" style="background-image: url('/static/cross.png')" id="remove-tag" onclick="removeTag('`
    + tag_input.value + `')"></div>`;
    parent.appendChild(new_tag);
    var add_tag = document.createElement('div');
    add_tag.id = "add-tag";
    add_tag.className = "add-tag";
    add_tag.onclick = function(){addTag();};
    var plus = document.createElement('div');
    plus.className = "plus";
    plus.style = `background-image: url('/static/plus.png')`;
    parent.appendChild(add_tag);
    add_tag.appendChild(plus);
    var xhr = new XMLHttpRequest();
	xhr.open("POST", "/profile/add_tag/");
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    var postData = new FormData();
    postData.append("imageid", document.getElementById('selectedId').innerHTML)
    postData.append('tag', tag_input.value)
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status === 200 || xhr.status === 204){

            }
            else{
                alert("Add failed");
            }
        }
    };
    xhr.send(postData);
}