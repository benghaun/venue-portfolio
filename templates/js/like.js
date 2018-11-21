function toggleLike(){
    //btn appearance toggle
    var like_btn = document.getElementById('like');
    var like_text = document.getElementById('like-text');
    var like_img = document.getElementById('like-img');
    if(like_text.innerHTML === "Liked"){
        console.log(like_btn.className);
        like_btn.className = 'like-btn';
        like_text.innerHTML = 'Like';
        like_img.style = `background-image: url('/static/like.png')`;        
    }
    else{        
        console.log(like_btn.className);
        like_btn.className = 'liked-btn';
        like_text.innerHTML = 'Liked';
        like_img.style = `background-image: url('/static/tick_boxless.png')`;
    }

    //http request
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