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
//    var xhr = new XMLHttpRequest();
//    xhr.open("GET", "/profile/get_meta?imageid=" + e.relatedTarget.getAttribute("data-img"));
//    xhr.onreadystatechange = function() {
//        if(xhr.readyState === 4){
//            if(xhr.status === 200 || xhr.status === 204){
//                console.log(xhr.responseText);
//                var metadata = JSON.parse(xhr.responseText);
//                liked = metadata.liked
//                var like_btn = document.getElementById('like');
//                var like_text = document.getElementById('like-text');
//                var like_img = document.getElementById('like-img');
//                if (!liked){
//                    console.log(like_btn.className);
//                    like_btn.className = 'like-btn';
//                    like_text.innerHTML = 'Like';
//                    like_img.style = `background-image: url('/static/like.png')`;
//                }
//                else{
//                    console.log(like_btn.className);
//                    like_btn.className = 'liked-btn';
//                    like_text.innerHTML = 'Liked';
//                    like_img.style = `background-image: url('/static/tick_boxless.png')`;
//                }
//                desc = metadata.description
//                document.getElementById('img-desc').innerHTML = desc
//                document.getElementById('img-title').innerHTML = "- " + e.relatedTarget.id.toUpperCase() + " -"
//            }
//            else{
//                console.error("Image data fetching failed")
//            }
//        }
//    }
//    xhr.send()
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