class Employee{
    static employeeCount = 0
       constructor(name, job, hours){
        this.name = name
        this.job = job
        this.hours = hours
        this.points = jobMap.get(job).points
        this.isServer = jobMap.get(job).isServer
        this.id = Employee.employeeCount
        Employee.employeeCount++
    }
    equalTo(otherEmployee){
        return otherEmployee.name===this.name&&otherEmployee.job===this.job
    }
}
document.addEventListener("DOMContentLoaded", startScripts)               
const jobMap = new Map()
const employeeList = []
const checkoutList = []

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
    const employeeCheckoutElement = document.getElementById("employeeCheckout")
    const employeeCheckoutLabelElement = document.getElementById("employeeCheckoutLabel")
    if(jobMap.get(new FormData(document.getElementById("createEmployeeForm")).get("job")).isServer){
        employeeCheckoutElement.classList.remove("hidden")
        employeeCheckoutLabelElement.classList.remove("hidden")
    }
    else{
        employeeCheckoutElement.classList.add("hidden")
        employeeCheckoutLabelElement.classList.add("hidden")
    }
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
    const employee = new Employee(formData.get("name"), formData.get("job"), formData.get("hours"))
    console.log(employee)
    const employeeDivElement = document.getElementById("employeeDiv")
    console.log("employee created")
}
function createCheckout(){
    const checkoutFormElement = document.getElementById("createCheckoutForm")
    if(!checkFieldsFilled(checkoutFormElement, ["name"])) return
    console.log("checkout created")
}
function createJob(){
    const jobFormElement = document.getElementById("createJobForm")
    if(!validateJob(jobFormElement)) 
    jobMap.set(formData.get("job"),{points: Number.parseFloat(formData.get("points")), isServer: formData.get("isServer")==="yes" ? true : false})
    const jobSelect = document.getElementById("employeeJob")
    jobSelect.append(new Option(formData.get("job")+" "+"("+formData.get("points")+")",formData.get("job")))
    jobFormElement.reset()
    jobSelect.selectedIndex = jobMap.size-1
    document.getElementById("employeeJob").dispatchEvent(new Event("change"))
    const employeeRadio = document.getElementById("employeeRadio")
    employeeRadio.checked = true
    employeeRadio.dispatchEvent(new Event("change", {bubbles: true}))
}


function checkFieldsFilled(formElement, fieldNames){
    const formData = new FormData(formElement)
    for(const name of fieldNames) if(!formData.get(name)) return false
    return true
}
function validateJob(jobFormElement){
    if(!checkFieldsFilled(jobFormElement, ["job", "points"])){
        console.log("job must have name and point value")
        return false
    }
    const formData = new FormData(jobFormElement)
    if(jobMap.has(formData.get("job"))){
        console.log("job with that name already exists")
        return false
    }
    return true
}
function validateEmployee(employeeformElement){
    if(!checkFieldsFilled(employeeformElement, ["name"])){
        console.log("employee must have name")
        return false
    }
    const isServer=jobMap.get(new FormData(employeeformElement).get("job")).isServer
    if(isServer&&!checkFieldsFilled(employeeformElement, ["checkout"])){
        console.log("server employee must have a checkout")
        return false
    }
    return true
}
