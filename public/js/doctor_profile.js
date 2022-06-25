
let params = (new URL(document.location)).searchParams;
let doc_id = params.get("doc_id");
console.log(doc_id)

let days = [0,1,2,3,4,5,6]
const elem = document.querySelector('input[name="start-date"]');

let doctor_data
$(window).on("load", function (){
    //
    document.getElementById('loading-screen').style.display = 'block'
    getDocData(doc_id).then(async (result) =>{
        doctor_data = result
        setDocData(doctor_data).then((result) =>{
            if(result == null){
                document.getElementById('loading-screen').style.display = 'none'
            }
        })
    })
    

    
});


function check_cookie(callback){
    if (callback != null){
        try{
            console.log("cookie found!")
            //window.location.href("/")
        }
        catch(e){
            console.log(e)
        }
    }else{
        window.location.href ="/signin"
    }
}


      
function disablePast() {
  let pastDaysList = []
  var pastday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
  for (let i = 0; i < 30; i++) {

    var dd = String(pastday.getDate()).padStart(2, '0');
    var mm = String(pastday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = pastday.getFullYear();
    pastDayDate = mm + '/' + dd + '/' + yyyy;
    pastDaysList.push(pastDayDate)
    pastday = new Date((pastday).valueOf() - 1000 * 60 * 60 * 24);
  }

  //console.log(pastday)
  return pastDaysList

}

let dateArr = ['05/11/2022', '05/10/2022']//disablePast()
console.log(dateArr)
//console.log(new Date(disablePast()))


async function getDocData(doc_id){
    let response = await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/getdoctor?doc_id=${doc_id}`)
    let data = await response.json()
    return data
}


let reason_code;
let final_fee
async function setDocData(data){
    //document.getElementById("loading-screen").style.display = "block";
    document.getElementById('doc-name').innerHTML = "Dr."+data.name
    document.getElementById('speciality').innerHTML = data.category
    document.getElementById('qualification').innerHTML = data.qualification
    document.getElementById("inlineRadio1-label").innerHTML = "Examination"+` (Fee: ${data.fee}LE)`
    document.getElementById("inlineRadio2-label").innerHTML = "Consultation"+` (Fee: ${data.fee1}LE)`
    $("#inlineRadio1").click(function(){
        document.getElementById("get-appointments").disabled = false
        reason_code = document.getElementById("inlineRadio1").value
        final_fee = data.fee
    })
    $("#inlineRadio2").click(function(){
        document.getElementById("get-appointments").disabled = false
        reason_code = document.getElementById("inlineRadio2").value
        final_fee = data.fee1
    })
    





    //document.getElementById("loading-screen").style.display = "none";
    return null

}

//let data = getDocData(doc_id)

async function workingDays(data, clinic_code){
    let working_days = data.clinics[clinic_code].working_days
    for(let i = 0; i< working_days.length; i++){
        days = days.filter((item) =>{
            return item != working_days[i].day_num
        })
    }
    console.log(days)
} 

async function makeTimes(data){
    console.log(data.average_time, data.working_days[1].from)
    for(let i =0; i<data.working_days.length; i++){
        for(let j =data.working_days[i].from; j< data.working_days[i].to ; j+=data.average_time){
            
            if(j==460 || j==560|| j == 760 || j==860 || j==960 || j==1060 || j==1160 || j==1260){
                j+=40
            }
            console.log(j)

        }
    }
    console.log('done')
    //let day = new Date("5/24/2022")
    //console.log(day.getDay())
}

async function getReservedTimes(doc_id){
    let response = await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/getAppointments?doc_id=${doc_id}`)
    let data = await response.json()
    
    if(data != 0){
        console.log(data)
        return data
        
    }
    else{
        data = {patients:[0]}
        console.log(data)
        return data
       
    }
    
}


async function setAvailableTimes(date, data, clinic_code){
    let day_date = new Date(date)
    let day = day_date.getDay()
    let working_days = data.clinics[clinic_code].working_days
    let available_times = []
    for(let i =0;i < working_days.length; i++){
        if(working_days[i].day_num == day){
            for(let j =working_days[i].from; j<working_days[i].to ; j+=working_days[i].average_time){

                if(j==360 || j==460 || j==560||j==660|| j == 760 || j==860 || j==960 || j==1060 || j==1160 || j==1260){
                    j+=40
                }
                //console.log(j)
                available_times.push(j)
            }
        }
    }
    return available_times
}

async function checkTime(reserved_times, available_times, date){
    let final_times = available_times
    for(let i=0; i<available_times.length; i++){
        for(let j =0; j<reserved_times.length; j++){
            if( date == reserved_times[j].date_stamp){
                if(available_times[i] == reserved_times[j].user_time){
                    let index = final_times.indexOf(available_times[i])
                    console.log(index , reserved_times[j].user_time)
                     final_times.splice(index, 1)
                   //console.log(reserved_times[j].user_time)
                }
            }
        }
    }
    //console.log(final_times)
    return final_times
}

async function makeAppointment(picked_date, reason_code, final_fee, date_stamp){
    let doc_ids = doc_id
    let user_id = await getCookie('user_id')
    let visit_id = Date.now()
    let fee;
    let formatedDate;
    let reason

    if(picked_date.toString().length >3){
        formatedDate = formatTime(picked_date.toString(),2,":")
    }else{
        formatedDate = formatTime(picked_date.toString(),1,":")
    }

    if(reason_code == 1){
        reason = "Examination"
    }else{
        reason = "Consultation"
    }
    console.log(doc_ids, user_id ,picked_date, reason_code, visit_id, final_fee)

    let modal_body = document.getElementById("modal-body")
    modal_body.innerHTML =`          
    Your Appointment: ${formatedDate}pm<br>
    Visit Reason: ${reason}<br>
    Fees: ${final_fee}<br>
    An SMS will be sent shortly to you upon doctor's confirmation with Google-map Clinic's location,
    Please Attend 15 mins before your appointment.`
    console.log("MODAL BODY"+ modal_body)

    $("#confirm-app-btn").click(async function(){
        window.location.href ="/myprofile"
        console.log(doc_ids, user_id ,picked_date, reason_code, visit_id, final_fee)
        document.getElementById('loading-screen').style.display = "block"
        document.getElementById("modal-content").style.display = "none"
        await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/set_appointment?doc_id=${doc_id}&user_id=${user_id}&visit_id=${visit_id}&user_time=${picked_date}&date_stamp=${date_stamp}&status_code=${"1"}&reason_code=${reason_code}&fees=${final_fee}&clinic_code=${0}`).then(()=>{
            
        })
        //let data = await response.json()
        

    })



}

let doc_data 
getDocData(doc_id).then( async (result) =>{
    //console.log(result)
    setDocData(result)
    
    workingDays(result,0)
    //makeTimes(result)


    $("#get-appointments").click(async ()=>{
        document.getElementById("pick-date").style.display = "none"
        try{
            document.getElementById("inner").innerHTML = ' '
        }catch(e){
            console.log(e)
        }
        let picked_date = document.getElementById('start-date').value
        const available_times = await setAvailableTimes(picked_date,result,0)
        const reserved_times = await getReservedTimes(doc_id)

        console.log("RESERVED TIME"+ JSON.stringify(reserved_times,0,2))
        //getReservedTimes(doc_id).then((data) =>{
        //    console.log(data.patients.length)
        //})
        checkTime(reserved_times.patients, available_times,picked_date).then((f) =>{
            console.log(f)
            return f
        })
        
        setAppointmentsCarousel( await checkTime(reserved_times.patients, available_times, picked_date))
    })
       
    
    
    //console.log(reserved_times)
    data = result
    doc_data = result
    const datepicker = new Datepicker(elem, {
        // ...options
        "daysOfWeekDisabled":days,
        "datesDisabled": disablePast(),
        "minDate": disablePast()[29]
      }); 
})

function formatTime(str, index, stringToAdd){
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

//console.log(formatTime("745",1,":"))

document.getElementById('start-date').addEventListener('change', () => {
    console.log(this.innerHTML)
    console.log("jaa")
})

function getDateInput(){
    let date = document.getElementById('start-date').value
    console.log(date)
    return date
}
document.getElementById('get-appointments').setAttribute('onclick', 'getDateInput()')
document.getElementById('get-appointments').disabled = true;


function appointmentBtn(date){
    let appointment_btn
    //let formatedDate
    console.log(date)
    if(date.toString().length >3){
        let formatedDate = formatTime(date.toString(), 2, ":")
        console.log(formatedDate)
        appointment_btn = `<button type="button" class="btn btn-light" data-toggle="modal" data-target="#exampleModalCenter" onclick="makeAppointment(${date}, ${reason_code}, ${final_fee}, '${getDateInput()}')" value="${date}">${formatedDate} pm</button>`
    }
    else{
        let formatedDate = formatTime(date.toString(), 1, ":")
        
        appointment_btn = `<button type="button" class="btn btn-light" data-toggle="modal" data-target="#exampleModalCenter" onclick="makeAppointment(${date}, ${reason_code}, ${final_fee},'${getDateInput()}')" value="${date}">${formatedDate} pm</button>`
    }
    return appointment_btn
    
}
let next_btn = `<button type="button" class="btn btn-light carousel-control-next"  href="#carouselExampleInterval"data-slide="next"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></button>`
let prev_btn = `<button type="button" class="btn btn-light carousel-control-prev" href="#carouselExampleInterval"  data-slide="prev"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i></button>`
let disabled_btn = `<button type="button" class="btn btn-light" disabled>--</button>`
let parentCarousel =  document.querySelector("#carouselExampleInterval")
//let carousel_item = document.createElement("div")
//carousel_item.setAttribute("class", "carousel-item")
let carousel_inner = document.getElementById("inner")



async function setAppointmentsCarousel(appointments){

    document.querySelector('#loading-appointments').style.display = "block !important"
    
   
    let count = Math.ceil(appointments.length /9)
    console.log(count)
    
    for(let i =0; i<count; i++){
        let carousel_group = document.createElement('div')
        carousel_group.setAttribute("class", "btn-group d-flex justify-content-center")
        carousel_group.setAttribute("role", "group")
        carousel_group.setAttribute("aria-label", "Basic example")
        let carousel_item = document.createElement('div')
        carousel_item.setAttribute("class", "carousel-item") 
        carousel_group.innerHTML+= prev_btn
        for(let j =0; j<9; j++){
            if(appointments[0] != undefined){
            let btn = appointmentBtn(appointments[0])
            //console.log(appointments[j])
            carousel_group.innerHTML+= btn
            appointments.shift()
            }
            else{
                let btn = disabled_btn
                carousel_group.innerHTML+= btn
            }
        }
        //console.log(carousel_item)
        
        carousel_group.innerHTML+= next_btn
        carousel_item.appendChild(carousel_group)
        carousel_inner.appendChild(carousel_item)

    }
    console.log(carousel_inner.childNodes)
    carousel_inner.childNodes[1].setAttribute("class", "carousel-item active")
    parentCarousel.appendChild(carousel_inner)
    parentCarousel.style.display = "block"
    document.querySelector('#loading-appointments').style.display = "none"


 console.log(appointments)
}

