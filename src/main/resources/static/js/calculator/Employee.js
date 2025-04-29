import Checkout from "./Checkout.js"
import {displayConfirmButton} from "./CreateController.js"
import {findSelectedOptionJob, getJobs} from "./Job.js"
import UpdateForm from "../util/UpdateForm.js"
import UpdateList from "../util/UpdateList.js"
import {checkFieldsFilled, numberCompare, stringCompare} from "../util/UtilityFunctions.js"
import TipsManager from "./TipsManager.js";
class Employee{
    static employeeCount = 0;
    static createEmployeeForm = document.getElementById("createEmployeeForm")
    static employeeList = new UpdateList([], document.getElementById("employeeList"), Employee.compareEmployees)
    constructor(name, job, hours){
        this.name = name
        this.job = job
        this.hours = hours
        this.id = Employee.employeeCount
        Employee.employeeCount++
        this.updateForm = null
        this.tips = 0
        this.job.employeeWorkHours += hours
        this.setHTML()
        Employee.employeeList.addItem(this)
        TipsManager.updateTips()
        displayConfirmButton()
    }
    static saveState(){
        //console.log("saving")
        //console.log("list:")
        //console.log(Employee.employeeList.objectList)
        sessionStorage.setItem("employeeList", JSON.stringify(Employee.employeeList.objectList, (key, value) => {
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
        //console.log("stringified: "+ sessionStorage.getItem("employeeList"))
    }
    static buildState(){
        //console.log("building")
        //console.log("parsed: ")
        //console.log(JSON.parse(sessionStorage.getItem("employeeList")))
        //console.log("building..")
        //console.log(getJobs())
        JSON.parse(sessionStorage.getItem("employeeList"), (key, value) => {
            if(value && value.job){
                return new Employee(value.name, getJobs().find(job => job.id === value.jobId), TipsManager.standardizeValue(value.hours))
            }
            return value
        })
        //console.log(employeeUpdateList.objectList)
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
        if(!checkFieldsFilled(employeeFormElement, ["hours"])){
            console.log("employee must have hours")
            return false
        }
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
    static compareEmployees(a, b){
        const diff = numberCompare(a.job.points, b.job.points)
        return diff !== 0 ? -diff : stringCompare(a.job.name, b.job.name)
    }
    static getEmployees(){
        return Employee.employeeList.objectList
    }
    static updateSelectElements(){
        const select = document.getElementById("createEmployeeForm").querySelector("select")
        Employee.employeeList.objectList.forEach(emp => {
            const newNode = select.cloneNode(true)
            newNode.classList.add("disabled")
            emp.updateForm.HTML.replaceChild(newNode, emp.updateForm.HTML.querySelector("select"))
            emp.updateForm.HTML.querySelector("option[data-job-option = '"+emp.job.id+"']").selected = true
        })
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
        if(!checkFieldsFilled(this.updateForm.HTML, ["name", "hours"])) return
        this.name = this.updateForm.HTML.querySelector("input[name='name']").value
        this.job.employeeWorkHours -= this.hours
        this.hours = TipsManager.standardizeValue(Number(this.updateForm.HTML.querySelector("input[name='hours']").value))
        this.updateForm.HTML.querySelector("input[name='hours']").value=TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.hours,-2))
        const newJobId = Number(this.updateForm.HTML.querySelector("select").selectedOptions[0].dataset.jobOption)
        this.job = getJobs().find((job) => job.id === newJobId)
        this.job.employeeWorkHours += this.hours
        TipsManager.updateTips()
        Employee.employeeList.sort()
        this.updateForm.closeEdit()
    }
    deleteFunction = () => {
        this.updateForm.HTML.remove()
        this.job.employeeWorkHours -= this.hours
        Employee.employeeList.removeItem(this)
        TipsManager.updateTips()
        displayConfirmButton()
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
        //document.getElementById("employeeList").append(this.updateForm.HTML)
    }

}
export const getEmployees = Employee.getEmployees
export const updateEmployeeSelectElements = Employee.updateSelectElements
export const employeeUpdateList = Employee.employeeList
export default Employee