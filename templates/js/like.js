function toggleLike(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/profile/like/");
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    var postData = new FormData();
    var imageId = document.getElementById("selectedId").innerHTML
    postData.append("image_id", imageId)
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status === 200 || xhr.status === 204){
                alert(xhr.responseText)
            }
            else{
                alert("Like failed.");
            }
        }
    };
    xhr.send(postData);
}