$(window).on("load", function () {
  if (getCookie("user_id") != null) {
    let user_id = getCookie("user_id");
    console.log("function ran");
    getAppointmentsData(user_id).then((result) => {
      if (result != null) {
        console.log(result.appointments);
        putAppointments(result);
      } else {
        console.log("ITS NULL");
        document.getElementById("app-table").style.display="none"
        document.getElementById("no-appointments").style.display = "block"
        document.getElementById("print-patient-report").style.pointerEvents = "none"
        document.getElementById("print-patient-report").style.backgroundColor = "gray"
      }
    });
  } else {
    // document.getElementById("profileBtn").style.display = 'none'
    // document.getElementById("profile-dropdown").style.display = 'none'
    // document.getElementById("loginBtn").style.display = 'block'
    window.location.href = "/signin";
  }

  //document.getElementById("loading-screen").style.display = "none"
});

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function viewProfile(doc_id) {
  let url = `doctor_profile?doc_id=${doc_id}`;
  let view_profile = `<a href=${url} class="badge badge-secondary">View Profile</a>`;
  return view_profile;
}

function viewPrescription(url) {
  let view_prescription_btn = `<a href="${url}" class="badge badge-primary">View Prescription</a>`;
  return view_prescription_btn;
}

function formatTime(str, index, stringToAdd) {
  return (
    str.substring(0, index) + stringToAdd + str.substring(index, str.length)
  );
}

function getReason(reason_code) {
  let examination_label =
    '<span class="badge badge-primary">Examination</span>';
  let consultation_label =
    '<span class="badge badge-secondary">Consultation</span>';
  if (parseInt(reason_code) == 1) {
    return examination_label;
  } else {
    return consultation_label;
  }
}

function getStatus(status_code) {
  status_code = parseInt(status_code);
  let complete_label = '<span class="badge badge-success">Completed</span>';
  let cancelled_label = '<span class="badge badge-danger">Cancelled</span>';
  let pending_label = '<span class="badge badge-warning">Pending</span>';
  let confirmed_label = '<span class="badge badge-primary">Confimed</span>';
  if (status_code == 1) {
    return pending_label;
  } else if (status_code == 2) {
    return confirmed_label;
  } else if (status_code == 3) {
    return complete_label;
  } else {
    return cancelled_label;
  }
}

function getPrescription(prescription) {
  let no_prescription =
    '<span class="badge badge-pill badge-light">No presciption</span></a>';
  if (prescription == "none") {
    return no_prescription;
  } else {
    let prescription_btn = `<a href="${prescription}" class="badge badge-primary">View Prescription</a>`;
    return prescription_btn;
  }
}
async function updateAppointmentStatus(doc_id,user_id,visit_id,user_time,status_code,date_stamp,reason_code,fees,prescription,clinic_code){
  let response = await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/status_appointment?doc_id=${doc_id}&user_id=${user_id}&visit_id=${visit_id}&user_time=${user_time}&status_code=${status_code}&date_stamp=${date_stamp}&reason_code=${reason_code}&fees=${fees}&prescription=${prescription}&clinic_code=${clinic_code}`)
  let data = await response.json()
  return data
}

function cancelAppointment(data){
  console.log("APPOINTMENT STATUS: "+ data.status_code)
  let caneclBtn = '<a href="#" class="badge badge-danger">Cancel</a>'
  let disabledCancelBtn = '<a href="#" class="badge badge-secondary"  style="pointer-events: none">Danger</a>'
  if (data.status_code == '3' ||data.status_code == '4'||data.status_code == '5' ){
    return disabledCancelBtn = '<a href="#" class="badge badge-secondary"  style="pointer-events: none">Cancel</a>'
  }else{
     return caneclBtn = '<a role="button" style="color:white" id="cancel-btn"class="badge badge-danger">Cancel</a>'

  }
}

function rateDoc(rate, rate_code, doc_id, visit_id) {
  if (rate == "none") {
    if (parseInt(rate_code) == 0) {
      let url = `/rate?doc_id=${doc_id}&visit_id=${visit_id}`;
      let rateBtn = `<a href="${url}" class="badge badge-secondary" style="pointer-events: none">Rate now</a>`;
      return rateBtn;
    } else {
      let url = `/rate?doc_id=${doc_id}&visit_id=${visit_id}`;
      let rateBtn = `<a href="${url}" class="badge badge-primary">Rate now</a>`;
      return rateBtn;
    }
  } else {
    let rate_label = `<span class="badge badge-success badge-pink">${rate}</span>`;
    return rate_label;
  }
}

async function getAppointmentsData(user_id) {
  try {
    let response = await fetch(
      `https://us-central1-medica72-5933c.cloudfunctions.net/api/getUserAppointments?user_id=${user_id}`
    );
    let data = await response.json();
    console.log(data);
    console.log("DATAT");
    return data;
  } catch (e) {
    return null;
  }
}

async function putAppointments(data) {
  let appointments = data.appointments;
  appointments = appointments.reverse();
  let appointments_table = document.getElementById("appointments-table");

  for (let i = 0; i < appointments.length; i++) {
    let tr_table = document.createElement("tr");
    let th = document.createElement("th");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let td6 = document.createElement("td");
    let td7 = document.createElement("td");
    let td8 = document.createElement("td");
    let td9 = document.createElement("td");
    let td10 = document.createElement("td");
    let td11 = document.createElement("td");

    let th_num = i + 1;
    th.innerHTML = th_num;

    let doc_name = appointments[i].name;
    let doc_speciality = appointments[i].speciality;
    let date = appointments[i].date_stamp;
    let time = appointments[i].user_time;
    let formatedTime;
    if (time.length > 3) {
      formatedTime = formatTime(time.toString(), 2, ":");
    } else {
      formatedTime = formatTime(time.toString(), 1, ":");
    }

    let reason = appointments[i].reason_code;
    let fees = appointments[i].fees;
    let status = appointments[i].status_code;
    let prescription = appointments[i].prescription;
    let doctor_id = appointments[i].doc_id;
    let rate = appointments[i].rating;
    let rate_code = appointments[i].rate_code;
    let visit_id = appointments[i].visit_id

    td1.innerHTML = doc_name;
    td2.innerHTML =
      doc_speciality.charAt(0).toUpperCase() + doc_speciality.slice(1);
    td3.innerHTML = date;
    td4.innerHTML = formatedTime;
    td5.innerHTML = getReason(reason);
    td6.innerHTML = fees;
    td7.innerHTML = getStatus(status);
    td8.innerHTML = getPrescription(prescription);
    td9.innerHTML = viewProfile(doctor_id);
    td10.innerHTML = rateDoc(rate, rate_code, doctor_id, visit_id);
    td11.innerHTML = cancelAppointment(appointments[i])

    tr_table.appendChild(th);
    tr_table.appendChild(td1);
    tr_table.appendChild(td2);
    tr_table.appendChild(td3);
    tr_table.appendChild(td4);
    tr_table.appendChild(td5);
    tr_table.appendChild(td6);
    tr_table.appendChild(td7);
    tr_table.appendChild(td8);
    tr_table.appendChild(td9);
    tr_table.appendChild(td10);
    tr_table.appendChild(td11)

    appointments_table.appendChild(tr_table);
    console.log("done" + i);

    $("#cancel-btn").click( function(){
      console.log("cancel-btn")
      //updateAppointmentStatus(appointments[i].doc_id,appointments[i].user_id,appointments[i].visit_id,appointments[i].user_time,"5",appointments[i].date_stamp,appointments[i].reason_code,appointments[i].fees,appointments[i].prescription,appointments[i].clinic_code)
    })
    
  }
}


