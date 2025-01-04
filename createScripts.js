document.addEventListener("DOMContentLoaded", startScripts)               
const jobMap = new Map()

function startScripts(){
    assignJobValues()
    document.getElementById("createEmployeeButton").addEventListener("click", createEmployee)
    document.getElementById("createCheckoutButton").addEventListener("click", createCheckout)
    document.getElementById("employeeJob").addEventListener("change", jobUpdate)
    document.getElementById("employeeName").addEventListener("input", copyEmployeeNameToCheckout)
    document.getElementById("createJobButton").addEventListener("click", createJob)
    jobUpdate()
}
function copyEmployeeNameToCheckout(){
    if(jobMap.get(document.getElementById("employeeJob").value)["isServer"]){
        document.getElementById("checkoutName").value=document.getElementById("employeeName").value
    }
}
function assignJobValues(){
    jobMap.set("Server",{points: 4.0, isServer: true})
    jobMap.set("Bar",{points: 4.0, isServer: false})
    jobMap.set("Host",{points: 4.0, isServer: false})
    jobMap.set("CH",{points: 1.75, isServer: false})
    jobMap.set("BBK",{points: 1.75, isServer: false})
    jobMap.set("Busser",{points: 1.5, isServer: false})
    const jobSelect = document.getElementById("employeeJob")
    for(const [key, values] of jobMap) jobSelect.append(new Option(key+" "+"("+values.points+")",key))
    jobMap.set("New",{points: 0, isServer: false})
    jobSelect.append(document.getElementById("newJobOption"))
    jobSelect.selectedIndex = 0
}
function jobUpdate(){
    const job = document.getElementById("employeeJob")
    if(job.value==="New"){
        document.getElementById("createJobForm").classList.remove("hidden")
    }
    else{
        document.getElementById("createJobForm").classList.add("hidden")
    }
    if(jobMap.get(job.value)["isServer"]){
        document.getElementById("checkoutName").value=document.getElementById("employeeName").value
        document.querySelectorAll("#employeeCheckoutLabel, #employeeCheckout").forEach(el=>el.classList.remove("hidden"))
    }
    else{
        document.querySelectorAll("#employeeCheckoutLabel, #employeeCheckout").forEach(el=>el.classList.add("hidden"))
        document.getElementById("checkoutName").value=""
    }
}
function createEmployee(){
    const employeeFormElement = document.getElementById("createEmployeeForm")
    if(!validateEmployee(employeeFormElement)) return
    const formData = new FormData(employeeFormElement)
    console.log("employee created")
    
}
function validateEmployee(employeeformElement){
    if(!checkFieldsFilled(employeeformElement, ["name"])) return false
    const isServer=jobMap.get(new FormData(employeeformElement).get("job")).isServer
    console.log(isServer)
    return isServer&&checkFieldsFilled(employeeformElement, ["checkout"])
}
function createCheckout(){
    const checkoutFormElement = document.getElementById("createCheckoutForm")
    if(!checkFieldsFilled(checkoutFormElement, ["name"])) return
    console.log("checkout created")
}
function createJob(){
    const jobFormElement = document.getElementById("createJobForm")
    if(!checkFieldsFilled(jobFormElement, ["job", "points"])) return
    const formData = new FormData(jobFormElement)
    jobMap.set(formData.get("job"),{points: Number.parseFloat(formData.get("points")), isServer: formData.get("isServer")==="yes" ? true : false})
    const jobSelect = document.getElementById("employeeJob")
    jobSelect.append(new Option(formData.get("job")+" "+"("+formData.get("points")+")",formData.get("job")))
    jobSelect.append(document.getElementById("newJobOption"))
    jobFormElement.reset()
    jobSelect.selectedIndex = jobMap.size-2
    jobSelect.dispatchEvent(new Event("change"))
}
function checkFieldsFilled(formElement, fieldNames){
    const formData = new FormData(formElement)
    for(const name of fieldNames) if(!formData.get(name)) return false
    return true
}