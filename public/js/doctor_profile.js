
let params = (new URL(document.location)).searchParams;
let doc_id = params.get("doc_id");
console.log(doc_id)

let days = [0,1,2,3,4,5,6]
const elem = document.querySelector('input[name="start-date"]');
      
      
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



async function setDocData(data){
    document.getElementById('doc-name').innerHTML = "Dr."+data.name
}

//let data = getDocData(doc_id)

async function workingDays(data){
    let working_days = data.working_days
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
    let data = response.json()
    return data
}

async function setAvailableTimes(date, data){
    let day_date = new Date(date)
    let day = day_date.getDay()
    let available_times = []
    for(let i =0;i < data.working_days.length; i++){
        if(data.working_days[i].day_num == day){
            for(let j =data.working_days[i].from; j< data.working_days[i].to ; j+=data.average_time){

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


// or(let k = 0; k < reserved_data.patients.length; k++){
//    if(date == reserved_data.patients[k].date_stamp){
//        if(){}
//    }
// 
let doc_data 
getDocData(doc_id).then( async (result) =>{
    //console.log(result)
    setDocData(result)
    workingDays(result)
    //makeTimes(result)


    $("#get-appointments").click(async ()=>{
        document.getElementById("pick-date").style.display = "none"
        try{
            document.getElementById("inner").innerHTML = ' '
        }catch(e){
            console.log(e)
        }
        let picked_date = document.getElementById('start-date').value
        const available_times = await setAvailableTimes(picked_date,result)
        const reserved_times = await getReservedTimes(doc_id)
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

console.log(formatTime("745",1,":"))

document.getElementById('start-date').addEventListener('change', () => {
    console.log(this.innerHTML)
    console.log("jaa")
})

function getDateInput(){
    let date = document.getElementById('start-date').value
    console.log(date)
}
document.getElementById('get-appointments').setAttribute('onclick', 'getDateInput()')



function appointmentBtn(date){
    let appointment_btn
    //let formatedDate
    console.log(date)
    if(date.toString().length >3){
        let formatedDate = formatTime(date.toString(), 2, ":")
        console.log(formatedDate)
        appointment_btn = `<button type="button" class="btn btn-light" value="${date}">${formatedDate} pm</button>`
    }
    else{
        let formatedDate = formatTime(date.toString(), 1, ":")
        
        appointment_btn = `<button type="button" class="btn btn-light" value="${date}">${formatedDate} pm</button>`
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

