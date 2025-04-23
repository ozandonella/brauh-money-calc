import EventHandler from "../util/EventHandler.js";
const clickHandler = new EventHandler("click")
//const touchenedHandler = new EventHandler("touchend")
const CLOUDFLAIR = "https://tips.brauhcalc.com"
const LOCALHOST = "http://localhost:8080"

window.addEventListener("pageshow", (event) => {
    /*console.log(
        JSON.stringify({
            employeeList: JSON.parse(sessionStorage.getItem("employeeList")),
            checkoutList: JSON.parse(sessionStorage.getItem("checkoutList")),
            jobList: JSON.parse(sessionStorage.getItem("jobList"))
        }, null, 2)
    )*/
    if(event.persisted) window.location.assign(window.location.href)
    console.log(sessionStorage.getItem("preview"))
    document.querySelector("[type = 'date']").valueAsDate = new Date();
    document.getElementById("preview").innerHTML = sessionStorage.getItem("preview");
    const submitButton = document.getElementById("submitButton")

    clickHandler.addElement("submitButtonClicked", postData, submitButton)
    clickHandler.appendTo(document.body)
})


const postData = () => {
    const body = JSON.stringify({
        primaryPerson: document.getElementById("primaryPerson").value,
        secondaryPerson: document.getElementById("secondaryPerson").value,
        date: document.getElementById("date").value,
        totalTips: sessionStorage.getItem("totalTips"),
        singlePointHourly: sessionStorage.getItem("singlePointHourly"),
        jobList: JSON.parse(sessionStorage.getItem("jobList"), (key, val) => {
            if(val.name) return {
                name: val.name,
                points: val.points
            }
            return val
        }), 
        employeeList: JSON.parse(sessionStorage.getItem("employeeList"), (key, val) => {
            if(val.tips) return {
                name: val.name,
                job: {
                    name: val.job.name,
                    points: val.job.points
                },
                hours: val.hours,
                tips: val.tips
            }
            return val
        }), 
        checkoutList: JSON.parse(sessionStorage.getItem("checkoutList"))
    }, 2)
    fetch(CLOUDFLAIR+"/download", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    })
    .then(res => {
        console.log(res)
        return res.json()
    })
    .then(data => {
        window.location.href = data.pdfUrl
        console.log(data)
    })
}