import EventHandler from "../util/EventHandler.js";
const clickHandler = new EventHandler("click")
const touchenedHandler = new EventHandler("touchend")

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("[type = 'date']").valueAsDate = new Date();
    document.getElementById("preview").innerHTML = sessionStorage.getItem("preview");
    const submitButton = document.getElementById("submitButton")

    clickHandler.addElement("submitButtonClicked", postData, submitButton)
    touchenedHandler.addElement("submitButtonTouchend", postData, submitButton)
    clickHandler.appendTo(document.body)
    touchenedHandler.appendTo(document.body)
    
})


const testPost = () => {
    fetch("http://localhost:8080/test", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                name: "bar",
                points: 4
            })
    })
}
const postData = () => {
    const body = JSON.stringify({
        primaryPerson: document.getElementById("primaryPerson").value,
        secondaryPerson: document.getElementById("secondaryPerson").value,
        date: document.getElementById("date").value,
        totalTips: sessionStorage.getItem("totalTips"),
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
    console.log(body)
    fetch("http://localhost:8080/download", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    })
    console.log("data posted")
}