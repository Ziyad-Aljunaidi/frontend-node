
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('speciality');
console.log(myParam)
async function goToSpeciality(speciality){
    let response = await fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/newdoctor?speciality=${speciality}`)
    let data = await response.json();
    return data
}

goToSpeciality(myParam).then((result) => {
    console.log(result[0].id)
})