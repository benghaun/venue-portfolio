var holder = document.getElementById('holder'),
    tests = {
      filereader: typeof FileReader != 'undefined',
      dnd: 'draggable' in document.createElement('span'),
      formdata: !!window.FormData,
      progress: "upload" in new XMLHttpRequest
    }, 
    support = {
      filereader: document.getElementById('filereader'),
      formdata: document.getElementById('formdata'),
      progress: document.getElementById('progress')
    },
    acceptedTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/gif': true
    },
    progress = document.getElementById('uploadprogress'),
    fileupload = document.getElementById('upload');

holder.onclick = function() {
    document.getElementById('my_image').click();
};

// "filereader formdata progress".split(' ').forEach(function (api) {
//   if (tests[api] === false) {
//     support[api].className = 'fail';
//   } else {
//     // FFS. I could have done el.hidden = true, but IE doesn't support
//     // hidden, so I tried to create a polyfill that would extend the
//     // Element.prototype, but then IE10 doesn't even give me access
//     // to the Element object. Brilliant.
//     support[api].className = 'hidden';
//   }
// });
$("#my_image").change(function() {
    var file = document.getElementById("my_image").files;
    readfiles(file);
});
function previewfile(file) {
	//Remove text and signs in upload box	
    var sign = document.getElementById("upload-sign");
    var text = document.getElementById("upload-text");
    sign.parentNode.removeChild(sign);
    text.parentNode.removeChild(text);
    //display file
  if (tests.filereader === true && acceptedTypes[file.type] === true) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var image = new Image();
      image.src = event.target.result;
      image.width = 250; // a fake resize
      holder.appendChild(image);
    };

    reader.readAsDataURL(file);
  }  else {
    holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
    console.log(file);
  }
}

function readfiles(files) {
	if (files[0].size > 5000000) {
		alert("File size cannot exceed 5MB")
		return;
	}
    // debugger;
    var formData = tests.formdata ? new FormData() : null;
    for (var i = 0; i < files.length; i++) {
      if (tests.formdata) formData.append('file', files[i]);
      previewfile(files[i]);
    }

    // now post a new XHR request
    if (tests.formdata) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload/getTags/');

      var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
	  xhr.setRequestHeader('X-CSRFToken', csrftoken);

      // xhr.onload = function() {
      //   progress.value = progress.innerHTML = 100;
      // };

      // if (tests.progress) {
      //   xhr.upload.onprogress = function (event) {
      //     if (event.lengthComputable) {
      //       var complete = (event.loaded / event.total * 100 | 0);
      //       progress.value = progress.innerHTML = complete;
      //     }
      //   }
      // }

      xhr.onreadystatechange = function() {
	    if(xhr.readyState === 4){
	      if(xhr.status === 200 || xhr.status === 204){
	        //alert(xhr.responseText);
	        cont = document.createElement("button");
	        cont.className = "submit-btn";
	        cont.innerHTML = "Continue";
	        cont.onclick = function(){
	        	var article = document.getElementById("article");
	        	article.parentNode.removeChild(article);
	        	var header = document.getElementById("assistant-speech");
	        	header.innerHTML = "Are these image tags correct?";
	        	var parent = document.getElementById("variable-content");
	        	parent.innerHTML = '';
	        	var tags = JSON.parse(xhr.responseText);
	        	for (var i=0; i<tags.length; i++){
	        			parent.innerHTML += `<input type="checkbox" class="checkbox" name="tag" 
	        			 id="` + tags[i] + `" checked>
                <label for="` + tags[i] + `">` + tags[i] + `</label><br>`;

	        	}
	        	parent.innerHTML += `<div style="font-weight: bold; position: absolute; bottom: 40%">Others:<div>`;
	        	var add_tags = document.createElement("input");
	        	add_tags.type = "text";
	        	add_tags.id = "extra_tags";
	        	add_tags.className = "extra-tags";
	        	add_tags.placeholder = "eg: portraits, sci-fi, etc.";
	        	parent.appendChild(add_tags);
	        	var upload = document.createElement("button");
	        	upload.innerHTML = "Upload";
	        	upload.className = "upload";
	        	upload.onclick = function(){getSignedRequest(files[0]);};
	        	parent.appendChild(upload);
	        };
	        document.getElementById("variable-content").appendChild(cont);
	      }
	      else{
	        alert("Could not get tags.");
	      }
	    }
	    };

      xhr.send(formData);
    }
}

if (tests.dnd) { 
  holder.ondragover = function () { this.className = 'hover'; return false; };
  holder.ondragend = function () { this.className = ''; return false; };
  holder.ondrop = function (e) {
    this.className = '';
    e.preventDefault();
    readfiles(e.dataTransfer.files);
  }
} else {
  fileupload.className = 'hidden';
  fileupload.querySelector('input').onchange = function () {
    readfiles(this.files);
  };
}


function getSignedRequest(file){
    var xhr = new XMLHttpRequest();
    var description = ""
    var title = "title"
    tags = ""
    
    $('input[type=checkbox]').each(function(){
        if(this.checked){
        	tags+=($(this).attr("id") + ",")
        }
    });

    tags = tags + document.getElementById("extra_tags").value;

    if (!file){
        return alert("No file selected.")
    }

    xhr.open("GET", "/upload/sign_s3?file_name="+file.name+"&file_type="+file.type+"&tags="+tags+"&description="+description+"&title="+title);
    xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        var response = JSON.parse(xhr.responseText);
        uploadFile(file, response.data, response.url);
      }
      else{
        alert("Could not get signed URL.");
      }
    }
    };
    xhr.send();
}

function uploadFile(file, s3Data, url){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", s3Data.url);
    var postData = new FormData();
    for(key in s3Data.fields){
        postData.append(key, s3Data.fields[key]);
    }
    postData.append('file', file);

    xhr.onreadystatechange = function() {
    if(xhr.readyState === 4){
      if(xhr.status === 200 || xhr.status === 204){
        alert("Upload successful");
      }
      else{
        alert("Could not upload file.");
      }
    }
    };
    xhr.send(postData);
}