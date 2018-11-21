$('#carousel-custom').on('slid.bs.carousel', function (e) {
    var index = $(e.target).find(".active").html();
    document.getElementById('img-title').innerHTML = "- " + e.relatedTarget.id.toUpperCase() + " -"
    document.getElementById('selectedId').innerHTML = e.relatedTarget.getAttribute("data-img")
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