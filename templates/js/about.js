String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
function addSkillset(newSkillSet){
    var addSkill = document.getElementById("add-skillset")
    parent = addSkill.parentNode;
    parent.removeChild(addSkill);
    var skill_input = document.createElement("input");
    skill_input.id = "skill-input";
    skill_input.type = "text";
    skill_input.className = "tag-input";
    parent.appendChild(skill_input);
    skill_input.select();
    var submit_tag = document.createElement("div");
    submit_tag.id = 'enter';
    submit_tag.className = "enter";
    submit_tag.style = `background-image: url('/static/enter.png')`;
    submit_tag.onclick = function(){submitTag();};
    parent.appendChild(submit_tag);
    skill_input.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
            // Enter pressed
            submitSkill();
        }
    }
}

function submitSkill(){
    var skill_input = document.getElementById("skill-input");
    var parent = skill_input.parentNode;
    //remove edit input
    parent.removeChild(skill_input);
    var enter = document.getElementById("enter");
    parent.removeChild(enter);
    //add new tag
    var new_tag = document.createElement("li");
    new_tag.className = "skill-tag";
    new_tag.id = skill_input.value;
    new_tag.innerHTML = `<span style="cursor: default;" class="skill-text">`
    + skill_input.value + `</span>
   <div class="cross" style="background-image: url('/static/cross.png')" id="remove-skillset" onclick="removeSkillset('`
    + skill_input.value + `')"></div>`;
    parent.appendChild(new_tag);
    var add_tag = document.createElement('div');
    add_tag.id = "add-tag";
    add_tag.className = "add-tag";
    add_tag.onclick = function(){addSkillset();};
    var plus = document.createElement('div');
    plus.className = "plus";
    plus.style = `background-image: url('/static/plus.png')`;
    parent.appendChild(add_tag);
    add_tag.appendChild(plus);
    var xhr = new XMLHttpRequest();
	xhr.open("POST", "/profile/add_skill/");
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    var postData = new FormData();
    postData.append('skill', skill_input.value)
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status === 200 || xhr.status === 204){

            }
            else if (xhr.status === 400){
                alert(xhr.responseText);
            }
            else {
                alert("An error occured")
            }
        }
    };
    xhr.send(postData);
}

function removeSkillset(skill){
	var skill_element = document.getElementById(skill);
	skill_element.parentNode.removeChild(skill_element);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/profile/del_skill/");
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    var postData = new FormData();
    postData.append('skill', skill)
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


function addMedium(){
    var addMedium = document.getElementById("add-medium")
    parent = addMedium.parentNode;
    parent.removeChild(addMedium);
    var medium_input = document.createElement("input");
    medium_input.id = "medium-input";
    medium_input.type = "text";
    medium_input.className = "tag-input";
    parent.appendChild(medium_input);
    medium_input.select();
    var submit_tag = document.createElement("div");
    submit_tag.id = 'enter';
    submit_tag.className = "enter";
    submit_tag.style = `background-image: url('/static/enter.png')`;
    submit_tag.onclick = function(){submitTag();};
    parent.appendChild(submit_tag);
    medium_input.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
            // Enter pressed
            submitMedium();
        }
    }
}

function submitMedium() {
    var medium_input = document.getElementById("medium-input");
    var parent = medium_input.parentNode;
    //remove edit input
    parent.removeChild(medium_input);
    var enter = document.getElementById("enter");
    parent.removeChild(enter);
    //add new tag
    var new_tag = document.createElement("li");
    new_tag.className = "medium-tag";
    new_tag.id = medium_input.value;
    new_tag.innerHTML = `<span style="cursor: default;" class="medium-text">`
    + medium_input.value + `</span>
   <div class="cross" style="background-image: url('/static/cross.png')" id="remove-skillset" onclick="removeMedium('`
    + medium_input.value + `')"></div>`;
    parent.appendChild(new_tag);
    var add_tag = document.createElement('div');
    add_tag.id = "add-tag";
    add_tag.className = "add-tag";
    add_tag.onclick = function(){addMedium();};
    var plus = document.createElement('div');
    plus.className = "plus";
    plus.style = `background-image: url('/static/plus.png')`;
    parent.appendChild(add_tag);
    add_tag.appendChild(plus);
    var xhr = new XMLHttpRequest();
	xhr.open("POST", "/profile/add_medium/");
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    var postData = new FormData();
    postData.append('medium', medium_input.value)
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status === 200 || xhr.status === 204){

            }
            else if (xhr.status === 400){
                alert(xhr.responseText);
            }
            else {
                alert("An error occured")
            }
        }
    };
    xhr.send(postData);
}

function removeMedium(medium){
	var medium_element = document.getElementById(medium);
	medium_element.parentNode.removeChild(medium_element);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/profile/del_medium/");
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    var postData = new FormData();
    postData.append('medium', medium)
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

function editProfileText(currentText){
    currentText = jQuery('<textarea/>').html(currentText).text();
    var description = document.getElementById('profile-description')
	var edit = document.getElementById('edit-profile-txt');
    description.innerHTML = '';
	var new_desc = document.createElement('input');
	new_desc.type = "text";
	new_desc.value = currentText;
	new_desc.className = "desc-input";
	description.appendChild(new_desc);
	new_desc.select();
    new_desc.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
            // Enter pressed
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/profile/edit_profile_desc/");
            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
            var postData = new FormData();
            new_desc_value = new_desc.value
            escaped_new_desc_value = jQuery('<div/>').text(new_desc.value).html().replaceAll("'", "&#39;");
            escaped_amp_value = escaped_new_desc_value.replace("&", "&amp;")
            postData.append('description', new_desc_value);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4){
                    if(xhr.status === 200 || xhr.status === 204){
                       description.innerHTML = escaped_new_desc_value
                       edit.onclick = function(){editProfileText(new_desc_value)};
                       description.appendChild(edit)
                    }
                    else{
                       alert("update failed");
                    }
             }
         };
         xhr.send(postData);
         return false;
        }
   }
}


function editWorkExp(currentText){
    currentText = jQuery('<textarea/>').html(currentText).text();
    var workexp = document.getElementById('work-experience')
	var edit = document.getElementById('edit-work-exp');
    workexp.innerHTML = '';
	var new_workexp = document.createElement('input');
	new_workexp.type = "text";
	new_workexp.value = currentText;
	new_workexp.className = "desc-input";
	workexp.appendChild(new_workexp);
	new_workexp.select();
    new_workexp.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
            // Enter pressed
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/profile/edit_work_exp/");
            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
            var postData = new FormData();
            new_workexp_value = new_workexp.value
            escaped_new_workexp_value = jQuery('<div/>').text(new_workexp.value).html().replaceAll("'", "&#39;");
            escaped_amp_value = escaped_new_workexp_value.replace("&", "&amp;")
            postData.append('workexp', new_workexp_value);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4){
                    if(xhr.status === 200 || xhr.status === 204){
                       workexp.innerHTML = escaped_new_workexp_value
                       edit.onclick = function(){editWorkExp(new_workexp_value)};
                       workexp.appendChild(edit)
                    }
                    else{
                       alert("update failed");
                    }
             }
         };
         xhr.send(postData);
         return false;
        }
   }
}

function editFb(){
    edit = document.getElementById("edit-fb");
    edit.style.display = "none";
    var fb = document.getElementById("fb-link")
    var currentLink = fb.innerHTML;
    if (currentLink === "Link your Facebook account in your profile..."){
        currentLink = ""
    }
    currentLink = jQuery('<textarea/>').html(currentLink).text();
    fb.innerHTML = ""
    var new_fb = document.createElement('input');
	new_fb.type = "text";
	new_fb.value = currentLink;
	new_fb.className = "desc-input";
	fb.appendChild(new_fb);
	new_fb.select();
    new_fb.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
            // Enter pressed
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/profile/edit_fb/");
            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
            var postData = new FormData();
            new_fb_value = new_fb.value
            escaped_new_fb_value = jQuery('<div/>').text(new_fb.value).html().replaceAll("'", "&#39;");
            escaped_amp_value = escaped_new_fb_value.replace("&", "&amp;")
            postData.append('fb', new_fb_value);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4){
                    if(xhr.status === 200 || xhr.status === 204){
                       fb.innerHTML = escaped_new_fb_value
                       edit.onclick = function(){editFb()};
                       edit.style.display = "block";
                    }
                    else if (xhr.status === 400){
                        alert(xhr.responseText)
                    }
                    else{
                       alert("update failed");
                    }
             }
         };
         xhr.send(postData);
         return false;
        }
   }
}

function editInsta(){
    edit = document.getElementById("edit-insta");
    edit.style.display = "none";
    var insta = document.getElementById("insta-link")
    var currentLink = insta.innerHTML;
    if (currentLink === "Link your Instagram account in your profile..."){
        currentLink = ""
    }
    currentLink = jQuery('<textarea/>').html(currentLink).text();
    insta.innerHTML = ""
    var new_insta = document.createElement('input');
	new_insta.type = "text";
	new_insta.value = currentLink;
	new_insta.className = "desc-input";
	insta.appendChild(new_insta);
	new_insta.select();
    new_insta.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
            // Enter pressed
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/profile/edit_insta/");
            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
            var postData = new FormData();
            new_insta_value = new_insta.value
            escaped_new_insta_value = jQuery('<div/>').text(new_insta.value).html().replaceAll("'", "&#39;");
            escaped_amp_value = escaped_new_insta_value.replace("&", "&amp;")
            postData.append('insta', new_insta_value);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4){
                    if(xhr.status === 200 || xhr.status === 204){
                       insta.innerHTML = escaped_new_insta_value
                       edit.onclick = function(){editInsta()};
                       edit.style.display = "block";
                    }
                    else if (xhr.status === 400){
                        alert(xhr.responseText)
                    }
                    else{
                       alert("update failed");
                    }
             }
         };
         xhr.send(postData);
         return false;
        }
   }
}