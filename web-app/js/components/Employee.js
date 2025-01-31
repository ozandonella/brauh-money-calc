import {checkFieldsFilled} from "./CreateController.js"
import {findSelectedOptionJob} from "./Job.js"
import UpdateForm from "./UpdateForm.js";
class Employee{
    static employeeCount = 0;
    static createEmployeemployeeForm = document.getElementById("createEmployeeForm")
    static employeeList = []
    constructor(name, job, hours){
        this.name = name
        this.job = job
        this.hours = hours
        this.id = Employee.employeeCount
        Employee.employeeCount++
        this.updateForm = null
        this.jobSelectHTML = null
        this.setHTML()
        document.getElementById("employeeList").append(this.updateForm.HTML)
    }
    static formCreate(){
        if(!Employee.validateEmployee(Employee.createEmployeemployeeForm)) return
        const formData = new FormData(Employee.createEmployeemployeeForm)
        const employee = new Employee(formData.get("name"), findSelectedOptionJob(), formData.get("hours"))
        if(employee.job.isServer){
            console.log("creating checkout...")
        } 
        console.log(employee)
        console.log("employee created")
    }
    
    static validateEmployee(employeeformElement){

        if(!checkFieldsFilled(employeeformElement, ["name"])){
            console.log("employee must have name")
            return false
        }
        const job = findSelectedOptionJob()
        if(job.isServer&&!checkFieldsFilled(employeeformElement, ["checkout"])){
            console.log("server employee must have a checkout")
            return false
        }
        return true
    }
    setFormWithThis(employeeFormElement){
        employeeFormElement.id = "Employee" + this.id
        const selectElement = employeeFormElement.querySelector("select")
        console.log(selectElement)
        employeeFormElement.querySelector("input[name='name']").value=this.name
        employeeFormElement.querySelector("input[name='hours']").value=this.hours
        
    }
    fillFunction = () => {
        this.updateForm.HTML.querySelector("input[name='name']").value=this.name
        this.updateForm.HTML.querySelector("input[name='hours']").value=this.hours
        this.updateForm.HTML.querySelector("select option[data-job-option = '"+this.job.id+"']").selected = true
    }
    updateFunction = () => {
        
    }
    deleteFunction = () => {
        
    }
    setHTML(){
        const updateFormHTML = Employee.createEmployeemployeeForm.cloneNode(true)
        this.setFormWithThis(updateFormHTML)
        this.updateForm = new UpdateForm(this.updateFunction, this.deleteFunction, this.fillFunction, "Employee", this.id, updateFormHTML)
        this.updateForm.HTML.setAttribute("class","updateForm")
        this.updateForm.HTML.querySelector("input[name='checkout']").remove()
        const tipOut = document.createElement("input")
        tipOut.setAttribute("type", "number")
        tipOut.setAttribute("class","tipOut")
        tipOut.name = "tipOut"
        tipOut.placeHolder = "Tips"
        tipOut.value = 0.00
    }

}
export default Employee