function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
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

async function verify(){
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
   
    let response = await fetch(`http://localhost:5000/medica72-5933c/us-central1/api/signin?email=${email}&password=${password}`)
    let data = await response.json();
    console.log(`http://localhost:5000/medica72-5933c/us-central1/api/signin?email=${email}&password=${password}`)
    console.log(data[0].email)
    if(data[0].email == email && data[0].password==password){
        setCookie("user_data", email, 30)
    }
    else{
        window.alert("email or password ar incorrect!")
        email , password = ""
    }


}

//setCookie("user_email","bobthegreat@gmail.com",30); //set "user_email" cookie, expires in 30 days
//var userEmail=getCookie("user_email");//"bobthegreat@gmail.com"

$("#myform").submit(function (e) {
    e.preventDefault();
    //setCookie("ser_email","zadj9965@gmail.com",30);
     //window.location.href = '/confirmation';
     verify();
    console.log("cookie saved successfully!")
  });
  