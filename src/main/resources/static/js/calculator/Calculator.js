import CreateController from "./CreateController.js";
import UpdateList from "../util/UpdateList.js";
import Employee from "./Employee.js"
import {numberCompare, stringCompare} from "../util/UtilityFunctions.js";

window.addEventListener("pageshow", async (event) => {
    if(event.persisted) {
        //console.log(sessionStorage.getItem("employeeList"))
        //alert("session persisted")
        window.location.assign(window.location.href)
    }
    else{
        //console.log(sessionStorage.getItem("employeeList"))
        //alert("session NOT persisted")
        if(!sessionStorage.getItem("state")) sessionStorage.setItem("state", "false")
        //await runTest("VALIDATETEST1.json")
        new CreateController()
    }
})
async function runTest(testName){
    console.log(sessionStorage.getItem("state"))
    if(sessionStorage.getItem("state") === "true") {
        console.log("session has saved state.. cannot run test")
        return
    }
    const res = await fetch("https://tips.brauhcalc.com/test/" + testName)
    const data = await res.json()
    sessionStorage.setItem("employeeList", JSON.stringify(data.employeeList))
    sessionStorage.setItem("jobList", JSON.stringify(data.jobList))
    sessionStorage.setItem("checkoutList", JSON.stringify(data.checkoutList))
    sessionStorage.setItem("state", "true")
}
