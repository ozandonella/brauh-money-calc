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
        this.name = name
        this.job = job
        this.hours = hours
        this.id = Employee.employeeCount
        Employee.employeeList.push(this)
        Employee.employeeCount++
        this.updateForm = null
        this.tips = 0
        this.job.employeeWorkHours += hours
        displayConfirmButton()
        this.setHTML()
        TipsManager.updateTips()

    }
    static saveState(){
        sessionStorage.setItem("employeeList", JSON.stringify(Employee.employeeList, (key, value) => {
            if(value instanceof Employee){
                return {
                    name: value.name,
                    jobId: value.job.id,
                    job: {
                        name: value.job.name,
                        points: TipsManager.moveDecimal(value.job.points,-2),
                        isServer: value.job.isServer
                    },
                    hours: TipsManager.moveDecimal(value.hours,-2),
                    tips: value.tips
                }
            }
            return value
        }, 2))
    }
    static buildState(){
        JSON.parse(sessionStorage.getItem("employeeList"), (key, value) => {
            if(value && value.hours){
                return new Employee(value.name, jobList.find(job => job.id === value.jobId), TipsManager.standardizeValue(value.hours))
            }
            return value
        })
    }
    static formCreate(){
        if(!Employee.validateEmployee(Employee.createEmployeeForm)) return
        const formData = new FormData(Employee.createEmployeeForm)
        const employee = new Employee(formData.get("name"), findSelectedOptionJob(), TipsManager.standardizeValue(formData.get("hours")))
        if(employee.job.isServer) new Checkout(employee.name, TipsManager.standardizeValue(Number(formData.get("checkout"))))
        const selectInd = Employee.createEmployeeForm.querySelector("select").selectedIndex
        Employee.createEmployeeForm.reset()
        Employee.createEmployeeForm.querySelector("select").selectedIndex = selectInd
    }
    
    static validateEmployee(employeeFormElement){

        if(!checkFieldsFilled(employeeFormElement, ["name"])){
            console.log("employee must have name")
            return false
        }
        const job = findSelectedOptionJob()
        if(job.isServer&&!checkFieldsFilled(employeeFormElement, ["checkout"])){
            console.log("server employee must have a checkout")
            return false
        }
        return true
    }

    setTips(tips) {
        this.tips = tips
        this.updateForm.HTML.querySelector(".tipOut").innerText = "$" + this.tips
    }
    setFormWithThis(employeeFormElement){
        employeeFormElement.id = "Employee" + this.id
        const selectElement = employeeFormElement.querySelector("select")
        selectElement.querySelector("[data-job-option = '"+this.job.id+"']").selected = true
        employeeFormElement.querySelector("input[name='name']").value=this.name
        employeeFormElement.querySelector("input[name='hours']").value=TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.hours,-2))
    }
    fillFunction = () => {
        this.updateForm.HTML.querySelector("input[name='name']").value=this.name
        this.updateForm.HTML.querySelector("input[name='hours']").value=TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.hours,-2))
        this.updateForm.HTML.querySelector("option[data-job-option = '"+this.job.id+"']").selected = true
    }
    updateFunction = () => {
        this.name = this.updateForm.HTML.querySelector("input[name='name']").value
        this.job.employeeWorkHours -= this.hours
        this.hours = TipsManager.standardizeValue(Number(this.updateForm.HTML.querySelector("input[name='hours']").value))
        this.updateForm.HTML.querySelector("input[name='hours']").value=TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.hours,-2))
        const newJobId = Number(this.updateForm.HTML.querySelector("select").selectedOptions[0].dataset.jobOption)
        this.job = jobList.find((job) => job.id === newJobId)
        this.job.employeeWorkHours += this.hours
        TipsManager.updateTips()
        this.updateForm.closeEdit()

    }
    deleteFunction = () => {
        this.updateForm.HTML.remove()
        this.job.employeeWorkHours -= this.hours
        const ind = Employee.employeeList.indexOf(this)
        Employee.employeeList.splice(ind, 1)
        if(Employee.employeeList.length > 0) Employee.employeeList[Math.min(ind, Employee.employeeList.length-1)].updateForm.select()
        displayConfirmButton()
        TipsManager.updateTips()
    }
    setHTML(){
        const formHTML = Employee.createEmployeeForm.cloneNode(true)
        this.setFormWithThis(formHTML)
        this.updateForm = new UpdateForm(this.updateFunction, this.deleteFunction, this.fillFunction, "Employee", this.id, formHTML)
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
export const saveState = () => Employee.saveState()
export const employeeList = Employee.employeeList
export default Employee