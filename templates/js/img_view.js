String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// is called whenever carousel slides
$('#carousel-custom').on('slid.bs.carousel', function (e) {
    var index = $(e.target).find(".active").html();

    // update titles and descriptions
    document.getElementById('selectedId').innerHTML = e.relatedTarget.getAttribute("data-img")
    document.getElementById('selectedTitle').innerHTML = e.relatedTarget.id
    document.getElementById('img-desc').innerHTML = e.relatedTarget.getAttribute("data-desc")
    document.getElementById('img-title').innerHTML = "- " + e.relatedTarget.id.toUpperCase() + " -"

    // update tags
    var tags = e.relatedTarget.getAttribute("data-tags").split(',')
    console.log(tags);
    var parent = document.getElementById("img-tags");
    parent.innerHTML = "Tags:"
    for (var i = 0; i<tags.length; i++){
        tag = tags[i]
        if (tag !== ""){
            var new_tag = document.createElement("li");
            new_tag.className = "img-tag";
            new_tag.id = tag;
            new_tag.innerHTML = `<span onclick="javascript:window.location.href='/search/?query=` + tag + `'" style="cursor: pointer;" class="tag-text">`
            + tag + `</span>
            <div class="cross" style="background-image: url('/static/cross.png')" id="remove-tag" onclick="removeTag('`
            + tag + `')"></div>`;
            parent.appendChild(new_tag);
        }
    }
    // add button to add new tags
    var add_tag = document.createElement('div');
    add_tag.id = "add-tag";
    add_tag.className = "add-tag";
    add_tag.onclick = function(){addTag();};
    var plus = document.createElement('div');
    plus.className = "plus";
    plus.style = `background-image: url('/static/plus.png')`;
    parent.appendChild(add_tag);
    add_tag.appendChild(plus);


    //update onclick methods of edit buttons
    document.getElementById('edit-title').onclick = function(){
        editTitle(e.relatedTarget.id);
    }
    document.getElementById('edit-desc').onclick = function(){
        editImageDescription(e.relatedTarget.getAttribute("data-desc"));
    }

    // ensure edit buttons are visible
    document.getElementById('edit-desc').style.display = 'block';
    document.getElementById('edit-title').style.display = 'block';


    // set correct status of like button
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
	var new_title = document.createElement('input');
	new_title.type = "text";
	new_title.value = currentTitle;
	new_title.className = "title-input";
	title.appendChild(new_title);
	new_title.select();
    new_title.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
            // Enter pressed
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/profile/edit_img_title/");
            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
            var postData = new FormData();
            new_title_value = new_title.value
            escaped_new_title_value = jQuery('<div/>').text(new_title.value).html().replaceAll("'", "&#39;");
            escaped_amp_value = escaped_new_title_value.replace("&", "&amp;")
            postData.append('title', new_title_value);
            postData.append('imageid', document.getElementById("selectedId").innerHTML);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4){
                    if(xhr.status === 200 || xhr.status === 204){
                       title.innerHTML = "- " + escaped_new_title_value.toUpperCase() + " -";
                       edit.style.display = 'block';
                       edit.onclick = function(){editTitle(new_title_value)};
                    }
                    else{
                       alert("Title update failed");
                    }
             }
         };
         xhr.send(postData);
         return false;
        }
   }
}

function editImageDescription(currentDesc){
    currentDesc = jQuery('<textarea/>').html(currentDesc).text();
	var edit = document.getElementById('edit-desc');
	edit.style.display = 'none';
	description = document.getElementById('img-desc');
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
            xhr.open("POST", "/profile/edit_img_desc/");
            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
            var postData = new FormData();
            new_desc_value = new_desc.value
            escaped_new_desc_value = jQuery('<div/>').text(new_desc.value).html().replaceAll("'", "&#39;");
            escaped_amp_value = escaped_new_desc_value.replace("&", "&amp;")
            postData.append('description', new_desc_value);
            postData.append('imageid', document.getElementById('selectedId').innerHTML);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4){
                    if(xhr.status === 200 || xhr.status === 204){
                        description.innerHTML = escaped_new_desc_value;
                        edit.style.display = 'block';
                        edit.onclick = function(){editImageDescription(new_desc_value)};
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
    new_tag.innerHTML = `<span onclick="javascript:window.location.href='/search/?query=` + tag_input.value + `'" style="cursor: pointer;" class="tag-text">`
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