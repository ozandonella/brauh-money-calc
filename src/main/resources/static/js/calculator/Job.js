import {checkFieldsFilled} from "./CreateController.js"
import {changeHandler} from "../util/EventHandler.js"
import UpdateForm from "./UpdateForm.js"
import {employeeList} from "./Employee.js"
import TipsManager from "./TipsManager.js"

class Job{
    static jobCount = 0
    static jobList = []
    static createJobForm = document.getElementById("createJobForm")
    static createEmployeeJobSelect = document.getElementById("createEmployeeForm").querySelector("select")
    constructor(name, points, isServer){
        this.id = Job.jobCount
        this.name = name
        this.points = points
        this.isServer = isServer
        this.optionHTML = null
        this.updateForm = null
        this.employeeWorkHours = 0
        Job.jobList.push(this)
        this.setHTML()
        Job.createEmployeeJobSelect.append(this.optionHTML)
        Job.jobCount++
    }
    static saveState(){
        sessionStorage.setItem("jobList", JSON.stringify(Job.jobList, (key, value) => {
            if(value instanceof Job){
                return {
                    name: value.name,
                    points: TipsManager.moveDecimal(value.points,-2),
                    isServer: value.isServer
                };
            }
            return value;
        }, 2))
    }
    static buildState(){
        JSON.parse(sessionStorage.getItem("jobList"), (key, value) => {
            if(value && value.name) return new Job(value.name, TipsManager.standardizeValue(value.points), value.isServer)
            return value
        })
    }
    static addListeners(){
        changeHandler.addElement("changedJobSelect", Job.jobUpdate, Job.createEmployeeJobSelect)
        changeHandler.addElement("changedCreateFormIsServer", Job.createIsServerUpdate, document.getElementById("isServer"))
    }
    static formCreate(){
        if(!Job.validateJobForm()) return
        const fromData = new FormData(Job.createJobForm)
        new Job(fromData.get("name"), TipsManager.standardizeValue(Number(fromData.get("points"))), fromData.get("isServer"))
        Job.createEmployeeJobSelect.selectedIndex = Job.createEmployeeJobSelect.options.length - 1
        Job.createJobForm.reset()
        Job.createJobForm.querySelector("input.checkbox").dispatchEvent(new Event("change", {bubbles : true}))
        Job.jobUpdate()
        const employeeRadio = document.getElementById("createForm").querySelector('input[value="Employee"]')
        employeeRadio.checked = true
        employeeRadio.dispatchEvent(new Event("change", {bubbles: true})) 
    }
    static validateJobForm(){
        console.log(Job.createJobForm)
        if(!checkFieldsFilled(Job.createJobForm, ["name", "points"])){
            console.log("job must have name and point value")
            return false
        }
        return true
    }
    static addBaseJobs(){
        new Job("Server", 400, true)
        new Job("Bar", 400, false)
        new Job("Host", 400, false)
        new Job("CH", 175, false)
        new Job("BBK", 175, false)
        new Job("Busser", 150, false)
    }
    static findSelectedOptionJob(){
        return Job.jobList.find(job => job.optionHTML.selected)
    }
    static jobUpdate(){
        const employeeCheckoutElement = document.getElementById("employeeCheckout")
        if(Job.findSelectedOptionJob().isServer) employeeCheckoutElement.classList.remove("hidden")
        else employeeCheckoutElement.classList.add("hidden")
    }
    static setLabel(label, value){
        if(value){
            label.innerText = "yes"
            label.classList.add("checked")
        }
        else{
            label.innerText = "no"
            label.classList.remove("checked")
        }
    }
    static createIsServerUpdate(){
        const label = document.getElementById("isServerLabel")
        const checkbox = document.getElementById("isServer")
        Job.setLabel(label, checkbox.checked)
        label.innerText = "Server: " + label.innerText
    }
    isServerUpdate = () => {
        const label = this.updateForm.HTML.querySelector("label")
        const checkbox = this.updateForm.HTML.querySelector("input.checkbox")
        Job.setLabel(label, checkbox.checked)
    }
    static printWorkHours(){
        jobList.forEach((job) => console.log(job.name +" "+job.employeeWorkHours))
    }
    static getCreateForm(){
        return Job.createJobForm
    }
    fillOptionWithThis(jobOptionHtml){
        jobOptionHtml.innerText = this.name+"("+TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.points,-2))+")"
        jobOptionHtml.value=this.name
    }
    setFormWithThis(jobFormElement){
        jobFormElement.id = "Job" +this.id
        const formData = new FormData(jobFormElement)
        formData.append("name", this.name)
        formData.append("points", TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.points,-2)))
        for(const [name, value] of formData.entries()){
            jobFormElement.querySelector("input[name='"+name+"']").value = value
        }
        const checkbox = jobFormElement.querySelector("input.checkbox")

        checkbox.id += "List" + Job.jobCount
        changeHandler.addElement("changedJob"+this.id+"isServer", this.isServerUpdate, checkbox)
        //checkbox.addEventListener("change", Job.isServerUpdate)
        const label = jobFormElement.querySelector("label.checkbox")
        label.setAttribute("for", checkbox.id)
        label.setAttribute("id", checkbox.id + "Label")
        checkbox.checked = this.isServer
        Job.setLabel(label, checkbox.checked)
    }
    fillFunction = () => {
        this.updateForm.HTML.querySelector("input[name='name']").value = this.name
        this.updateForm.HTML.querySelector("input[name='points']").value = TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.points,-2))
        const checkbox = this.updateForm.HTML.querySelector("input.checkbox")
        const label = this.updateForm.HTML.querySelector("label.checkbox")
        checkbox.checked = this.isServer
        Job.setLabel(label, checkbox.checked)
    }

    updateFunction = () => {
        const form = new FormData(this.updateForm.HTML)
        for(const [key, value] of form.entries()){
            this[key] = value
            console.log(key)
        }
        this.points = TipsManager.standardizeValue(this.points)
        this.isServer = this.updateForm.HTML.querySelector("input.checkbox").checked
        this.fillOptionWithThis(this.optionHTML)
        /*UPDATE SERVER LIST LOGIC*/
        employeeList.forEach((employee) => {
            const currOption = employee.updateForm.HTML.querySelector("[data-job-option = '"+this.id+"']")
            currOption.innerText = this.name + "(" + TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.points,-2)) + ")"
        })
        TipsManager.updateTips()
        this.updateForm.closeEdit()
        Job.jobUpdate()
    }
    deleteFunction = () => {
        if(Job.jobList.length === 1){
            console.log("must have at least one job")
            return
        }
        this.updateForm.HTML.remove()
        this.optionHTML.remove()

        /*UDATE EMPLOYEE JOBS*/
        employeeList.forEach((employee) => {
            const currSelect = employee.updateForm.HTML.querySelector("select")
            currSelect.querySelector("[data-job-option = '"+this.id+"']").remove()
            if(employee.job.id === this.id){
                this.employeeWorkHours -= employee.hours
                employee.job = Job.jobList.find((job) => job.id === currSelect.selectedOptions[0].dataset.jobOption)
                employee.job.employeeWorkHours += employee.hours
            } 
        })
        if(!Job.findSelectedOptionJob()) Job.createEmployeeJobSelect.selectedIndex = 0;
        const ind = Job.jobList.indexOf(this)
        Job.jobList.splice(ind, 1)
        Job.jobList[Math.min(ind, Job.jobList.length-1)].updateForm.select()
        TipsManager.updateTips()
        Job.jobUpdate()
    }
    setHTML(){
        const createJobOptionFromThis = () => {
            const option = document.createElement("option")
            option.setAttribute("data-job-option", String(this.id))
            this.fillOptionWithThis(option)
            return option
        }
        employeeList.forEach((employee) => employee.updateForm.HTML.querySelector("select").append(createJobOptionFromThis()))
        this.optionHTML = createJobOptionFromThis()
        const formHTML = Job.createJobForm.cloneNode(true)
        this.setFormWithThis(formHTML)
        this.updateForm = new UpdateForm(this.updateFunction, this.deleteFunction, this.fillFunction, "Job", this.id, formHTML)
        this.updateForm.HTML.setAttribute("class","jobUpdateForm")
        this.updateForm.HTML.classList.add("updateFormInputStyle")        
        document.getElementById("jobList").append(this.updateForm.HTML)
        if(!UpdateForm.selectedUpdateForm) this.updateForm.HTML.dispatchEvent(new Event("click", {bubbles: true}))
        
    }
}
export const findSelectedOptionJob = Job.findSelectedOptionJob
export const jobList = Job.jobList
export default Job