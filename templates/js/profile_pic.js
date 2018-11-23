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
    var file = files[0]
    // now post a new XHR request
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload/profilepic/?file_name=' + file.name + "&file_type=" + file.type);

      var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
	  xhr.setRequestHeader('X-CSRFToken', csrftoken);

      xhr.onreadystatechange = function() {
	    if(xhr.readyState === 4){
	      if(xhr.status === 200 || xhr.status === 204){
            var response = JSON.parse(xhr.responseText);
            uploadFile(file, response.data, response.url);

	      }
	      else{

	      }
	    }
	    };

      xhr.send(formData);

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

      }
      else{
        alert("Could not upload file.");
      }
    }
    };
    xhr.send(postData);
}