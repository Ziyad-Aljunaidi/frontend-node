document.getElementById("loading-screen").style.display = "block"

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
        document.getElementById("profile-dropdown").style.display = 'black'
        document.getElementById("loginBtn").style.display = 'none'
    }else{
        // document.getElementById("profileBtn").style.display = 'none'
        // document.getElementById("profile-dropdown").style.display = 'none'
        // document.getElementById("loginBtn").style.display = 'block'
        window.location.href = "/signin"
        
    }

    //document.getElementById("loading-screen").style.display = "none"
})

let user_id = getCookie('user_id')
console.log(user_id)

async function getUserData(user_id){
    let response = await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/getUser?user_id=${user_id}`)
    let data = await response.json()
    return data
}

let userData
getUserData(user_id).then(async(result) =>{
    console.log(result)
    userData = result
    
    
        await putUserData(userData)
    document.getElementById("loading-screen").style.display = "none"
})


async function putUserData(data){
    
    let first_name = data.first_name
    let last_name = data.last_name
    let full_name = first_name+" "+last_name
    let email = data.email
    let birthday = data.date_of_birth
    let phone_number = data.phone_number
    let national_id = data.national_id

    document.getElementById("profile-main").childNodes[1].innerHTML = full_name
    document.getElementById("profile-main").childNodes[3].innerHTML = email
    document.getElementById("profile-main").childNodes[5].innerHTML = "Date of birth: "+birthday
    //console.log()
    document.getElementById("f-name").innerHTML = first_name
    document.getElementById("l-name").innerHTML = last_name
    document.getElementById("email").innerHTML = email
    document.getElementById("p-num").innerHTML = phone_number
    document.getElementById("n-id").innerHTML = national_id
    document.getElementById("b-day").innerHTML = birthday


    

}

async function editInfo(data){
    let first_name = data.first_name
    let last_name = data.last_name
    let id = data.id
    let full_name = first_name+" "+last_name
    let email = data.email
    let password = data.password
    let birthday = data.date_of_birth
    let phone_number = data.phone_number
    let national_id = data.national_id
    let gender = data.gender

    document.getElementById("Fname").value = first_name
    document.getElementById("Lname").value = last_name
    document.getElementById("Email").value = email
    document.getElementById("Birthday").value = birthday
    document.getElementById("NID").value = national_id
    document.getElementById("PhoneNumber").value = phone_number



}

document.getElementById("edt-btn").addEventListener("click", function(){
    console.log("clicked")
    document.getElementById("edit-personal-info").style.display = 'block'
    document.getElementById("personal-info").style.display = 'none'
    editInfo(userData)
    
})


$("#save-btn").click(async function (){
   // document.getElementById('loading-screen').style.display = "block"
    console.log("click m8")
    let first_name = document.getElementById("Fname").value
    let last_name = document.getElementById("Lname").value
    let id = userData.id
    let full_name = first_name+" "+last_name
    let email =document.getElementById("Email").value
    let password = userData.password
    let birthday = document.getElementById("Birthday").value
    let phone_number = document.getElementById("PhoneNumber").value 
    let national_id = document.getElementById("NID").value
    let gender = userData.gender

    console.log(first_name, last_name, id, email, password, birthday, phone_number, national_id, gender)
    let response = await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/saveUserInfo?id=${id}&first_name=${first_name}&last_name=${last_name}&email=${email}&date_of_birth=${birthday}&phone_number=${phone_number}&national_id=${national_id}&gender=${gender}&password=${password}`)
    //let response = await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/saveUserInfo?id=18013&first_name=ZIYAD&last_name=noga&email=noga@gmail.com&phone_number=01113357439&national_id=88888&gender=f&date_of_birth=9-9-2019&password=msssoga3yma`)
    let data =await response.json()
    console.log(data)
    location.reload();
    
})