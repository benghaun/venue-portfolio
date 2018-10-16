$('#img-title').bind('slid', function (e) {
    alert('hi');
    var index = $(e.target).find(".active").index();
    if(index === 1) //  (2 - 1) index is zero based
        alert('slide2 displayed!');
});