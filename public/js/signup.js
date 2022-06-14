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

async function signUp(){
    const radioButtons = document.querySelectorAll('input[name="gender"]');
    let gender ;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            gender = radioButton.value;
            break;
        }
    }

    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    let first_name = document.getElementById("first_name").value
    let last_name = document.getElementById("last_name").value
    let national_id = document.getElementById("national_id").value
    let date_of_birth = document.getElementById("date_of_birth").value
    let phone_number = document.getElementById("phone_number").value

    console.log(first_name, last_name, password,email,gender, date_of_birth, national_id, phone_number)
   
    let response = await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/addUser?email=${email}&password=${password}&first_name=${first_name}&last_name=${last_name}&gender=${gender}&date_of_birth=${date_of_birth}&phone_number=${phone_number}&national_id=${national_id}`)
    let data = await response.json();
    window.alert("You successfully created an account, redirect to sign in page..")
    window.location.href= '/signin'
    //console.log(`https://us-central1-medica72-5933c.cloudfunctions.net/api/addUser?email=${email}&password=${password}`)
    //console.log(data[0].email)


}

//setCookie("user_email","bobthegreat@gmail.com",30); //set "user_email" cookie, expires in 30 days
//var userEmail=getCookie("user_email");//"bobthegreat@gmail.com"

$("#myform").submit(function (e) {
    e.preventDefault();
    //setCookie("ser_email","zadj9965@gmail.com",30);
     //window.location.href = '/confirmation';
    signUp();
     
    console.log("cookie saved successfully!")
  });
  
