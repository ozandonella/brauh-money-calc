import CreateController from "./CreateController.js";
import TipsManager from "./TipsManager.js";

document.addEventListener("DOMContentLoaded", () => {
    new CreateController()
    //runTest("VALIDATETEST1.json")
})
function runTest(testName){
    fetch("https://tips.brauhcalc.com/test/"+testName).then(res => {
        return res.json()
    }).then(data => {
        sessionStorage.setItem("state", "true")
        sessionStorage.setItem("employeeList", JSON.stringify(data.employeeList))
        sessionStorage.setItem("jobList", JSON.stringify(data.jobList))
        sessionStorage.setItem("checkoutList", JSON.stringify(data.checkoutList))
        new CreateController()
    })
}
