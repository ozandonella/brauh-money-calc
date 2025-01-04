document.addEventListener("DOMContentLoaded", startScripts)               
const jobMap = new Map()

function startScripts(){
    assignJobValues()
    document.getElementById("createButton").addEventListener("click", createFunction)
    document.getElementById("createForm").addEventListener("change", displayCreationData)
    document.getElementById("employeeJob").addEventListener("change", jobUpdate)
    document.getElementById("employeeName").addEventListener("input", copyEmployeeNameToCheckout)
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
    jobSelect.selectedIndex = 0
}
function jobUpdate(){

}
function displayCreationData(event){
    if(event.target.name!=="createRadio") return
    const divName = "create"+event.target.value+"Div"
    document.querySelectorAll(".createFormData").forEach(el=>{
        if(el.id===divName) el.classList.remove("hidden")
        else(el.classList.add("hidden"))
    }) 
}
function createFunction(){
    const createFormElement = document.getElementById("createForm")
    if(!checkFieldsFilled(createFormElement, ["createRadio"])) return
    const createTarget = new FormData(createFormElement).get("createRadio")
    if(createTarget==="Employee") createEmployee()
    else if(createTarget==="Job") createJob()
    else createCheckout()
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
    jobFormElement.reset()
    jobSelect.selectedIndex = jobMap.size-1
    jobSelect.dispatchEvent(new Event("change"))
}
function checkFieldsFilled(formElement, fieldNames){
    const formData = new FormData(formElement)
    for(const name of fieldNames) if(!formData.get(name)) return false
    return true
}