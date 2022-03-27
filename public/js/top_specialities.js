
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('speciality');
console.log(myParam)
async function goToSpeciality(speciality) {
    let response = await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/newdoctor?speciality=${speciality}`)
    let data = await response.json();
    return data
}

function appendDataToDiv(data) {

    for(let i=0; i<=data.length; i++){
        let parent_div = document.createElement("div");
    parent_div.className = "res-card";

    let container = document.createElement("div");
    container.className = "container";

    let btn_div = document.createElement("div")
    let appointment_btn = document.createElement("a")
    //appointment_btn.href = `/appointment?doc_name=${data[i].name}&doc_id=${data[i].id}`
    appointment_btn.href = `/newappointment?doc_name=${data[i].name}&doc_id=${data[i].id}`
    appointment_btn.className = "btn btn-main-2 btn-icon btn-round-full"
    appointment_btn.innerHTML = "Make appointment <i class='icofont-simple-right ml-2'>"

    let doc_img = document.createElement("img");
    doc_img.src = "images/team/1.jpg";
    doc_img.alt = "doc_avatar";

    let ul_parent = document.createElement("ul");
    let doc_info_li1 = document.createElement("li");
    let doc_info_li2 = document.createElement("li");
    let doc_info_li3 = document.createElement("li");
    let doc_info_li4 = document.createElement("li");
    let doc_info_li5 = document.createElement("li");
    let doc_name_h5 = document.createElement("h5");
    let doc_info_p = document.createElement("p");

    doc_name_h5.innerHTML = "Dr. "+data[i].name
    ul_parent.appendChild(doc_name_h5)

    doc_info_li1.innerHTML = "Speciality: "+data[i].category
    ul_parent.appendChild(doc_info_p)

    doc_info_li2.innerHTML = "City: " + data[i].city
    ul_parent.appendChild(doc_info_p)

    doc_info_li3.innerHTML = "Address: " + data[i].address

    doc_info_li4.innerHTML = "Fee: " +data[i].fee
    //doc_info_li5.innerHTML = data[0].qualification


    ul_parent.appendChild(doc_info_li1)
    ul_parent.appendChild(doc_info_li2)
    ul_parent.appendChild(doc_info_li3)
    ul_parent.appendChild(doc_info_li4)
    ul_parent.appendChild(doc_info_li5)


    parent_div.appendChild(container)
    container.appendChild(doc_img)
    container.appendChild(ul_parent)
    container.appendChild(appointment_btn)


    document.body.appendChild(parent_div)
    

    }

    
    
}


//appendDataToDiv("haha")
goToSpeciality(myParam).then((result) => {
    console.log(result)
    document.querySelector('#loading').style.visibility = "hidden"
    appendDataToDiv(result)
    

})