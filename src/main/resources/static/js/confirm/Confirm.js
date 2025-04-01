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

const postData = () => {
    fetch("http://localhost:8080/download", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            primaryPerson: document.getElementById("primaryPerson").value,
            secondaryPerson: document.getElementById("secondaryPerson").value,
            date: document.getElementById("date").value,
            totalTips: sessionStorage.getItem("totalTips"),
            jobList: JSON.parse(sessionStorage.getItem("jobList")), 
            employeeList: JSON.parse(sessionStorage.getItem("employeeList")), 
            checkoutList: JSON.parse(sessionStorage.getItem("checkoutList"))
        })
    }).then(response => {
        return response.blob()
    }).then(blob => {
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    })
    console.log("data posted")
}