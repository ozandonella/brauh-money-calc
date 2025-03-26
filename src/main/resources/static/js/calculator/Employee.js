import Checkout from "./Checkout.js";
import {checkFieldsFilled, displayConfirmButton} from "./CreateController.js"
import {findSelectedOptionJob, jobList} from "./Job.js"
import UpdateForm from "./UpdateForm.js";
import TipsManager from "./TipsManager.js";
class Employee{
    static employeeCount = 0;
    static createEmployeeForm = document.getElementById("createEmployeeForm")
    static employeeList = []
    constructor(name, job, hours){
        hours = Math.floor(hours*100)/100
        this.name = name
        this.job = job
        this.hours = hours
        this.id = Employee.employeeCount
        Employee.employeeList.push(this)
        Employee.employeeCount++
        this.updateForm = null
        this.jobSelectHTML = null
        this.tips = 0
        this.job.employeeWorkHours += hours
        displayConfirmButton()
        this.setHTML()

        TipsManager.updateTips()
    }
    static formCreate(){
        if(!Employee.validateEmployee(Employee.createEmployeeForm)) return
        const formData = new FormData(Employee.createEmployeeForm)
        const employee = new Employee(formData.get("name"), findSelectedOptionJob(), Number(formData.get("hours")))
        if(employee.job.isServer) new Checkout(employee.name, Number(formData.get("checkout")))
        const selectInd = Employee.createEmployeeForm.querySelector("select").selectedIndex
        Employee.createEmployeeForm.reset()
        Employee.createEmployeeForm.querySelector("select").selectedIndex = selectInd
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
    static getCreateForm(){
        return Employee.createEmployeeForm
    }
    setTips(tips){
        this.tips = tips
        this.updateForm.HTML.querySelector(".tipOut").innerText = "$"+tips
    }
    setFormWithThis(employeeFormElement){
        employeeFormElement.id = "Employee" + this.id
        const selectElement = employeeFormElement.querySelector("select")
        selectElement.querySelector("[data-job-option = '"+this.job.id+"']").selected = true
        employeeFormElement.querySelector("input[name='name']").value=this.name
        employeeFormElement.querySelector("input[name='hours']").value=TipsManager.getHundredthsRep(this.hours)
    
    }
    fillFunction = () => {
        this.updateForm.HTML.querySelector("input[name='name']").value=this.name
        this.updateForm.HTML.querySelector("input[name='hours']").value=TipsManager.getHundredthsRep(this.hours)
        this.updateForm.HTML.querySelector("option[data-job-option = '"+this.job.id+"']").selected = true
    }
    updateFunction = () => {
        this.name = this.updateForm.HTML.querySelector("input[name='name']").value
        this.job.employeeWorkHours -= this.hours
        this.hours = Math.floor(100*Number(this.updateForm.HTML.querySelector("input[name='hours']").value))/100
        this.updateForm.HTML.querySelector("input[name='hours']").value=TipsManager.getHundredthsRep(this.hours)
        const newJobId = this.updateForm.HTML.querySelector("select").selectedOptions[0].dataset.jobOption
        this.job = jobList.find((job) => job.id == newJobId)
        this.job.employeeWorkHours += this.hours
        TipsManager.updateTips()
        this.updateForm.closeEdit()
        //UPDATE TIPS
    }
    deleteFunction = () => {
        this.updateForm.HTML.remove()
        this.job.employeeWorkHours -= this.hours
        const ind = Employee.employeeList.indexOf(this)
        Employee.employeeList.splice(ind, 1)
        if(Employee.employeeList.length > 0) Employee.employeeList[Math.min(ind, Employee.employeeList.length-1)].updateForm.select()
        displayConfirmButton()
        TipsManager.updateTips()
        //UPDATE TIPS
    }
    setHTML(){
        const updateFormHTML = Employee.createEmployeeForm.cloneNode(true)
        this.setFormWithThis(updateFormHTML)
        this.updateForm = new UpdateForm(this.updateFunction, this.deleteFunction, this.fillFunction, "Employee", this.id, updateFormHTML)
        this.updateForm.HTML.setAttribute("class","updateFormInputStyle")
        this.updateForm.HTML.classList.add("employeeUpdateForm")
        this.updateForm.HTML.querySelector("input[name='checkout']").remove()
        const tipOut = document.createElement("div")
        tipOut.setAttribute("class","tipOut")
        tipOut.innerText = "$0"
        this.updateForm.HTML.append(tipOut)
        document.getElementById("employeeList").append(this.updateForm.HTML)
    }

}
export const employeeList = Employee.employeeList
export default Employee