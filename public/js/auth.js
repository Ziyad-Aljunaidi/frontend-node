//document.getElementById("profileBtn").style.display = 'none'


function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}



$(window).on("load", function(){
    if(getCookie("user_id") != null){
        document.getElementById("profileBtn").style.display = 'block'
        document.getElementById("loginBtn").style.display = 'none'
    }else{
        document.getElementById("profileBtn").style.display = 'none'
        document.getElementById("loginBtn").style.display = 'block'
    }
})