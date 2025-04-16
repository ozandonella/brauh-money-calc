import CreateController from "./CreateController.js";
import TipsManager from "./TipsManager.js";

document.addEventListener("DOMContentLoaded", () => {
    //TipsManager.testMoveDecimal()
    new CreateController()
})
function runTest(testName){
    sessionStorage.setItem("state", "true")
    let testObj = null
    fetch("test/"+testName).then(res => {
        return res.json()
    })
        .then(data => testObj = JSON.parse(data))
    console.log(testObj.employeeList)
}
