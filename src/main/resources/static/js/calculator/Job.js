import {checkFieldsFilled, numberCompare} from "../util/UtilityFunctions.js"
import {changeHandler} from "../util/EventHandler.js"
import UpdateForm from "../util/UpdateForm.js"
import UpdateList from "../util/UpdateList.js"
import {getEmployees, employeeUpdateList, updateEmployeeSelectElements} from "./Employee.js"
import TipsManager from "./TipsManager.js"

class Job{
    static jobCount = 0
    static jobList = new UpdateList([], document.getElementById("jobList"), Job.compareJobs)
    static createJobForm = document.getElementById("createJobForm")
    static createEmployeeJobSelect = document.getElementById("createEmployeeForm").querySelector("select")
    constructor(name, points, isServer, id = Job.jobCount){
        this.id = id
        this.name = name
        this.points = points
        this.isServer = isServer
        this.optionHTML = null
        this.updateForm = null
        this.employeeWorkHours = 0
        this.rate = 0
        this.setHTML()
        Job.jobList.addItem(this)
        Job.updateJobSelect()
        updateEmployeeSelectElements()
        Job.jobCount = Math.max(Job.jobCount, id) + 1
    }
    static saveState(){
        sessionStorage.setItem("jobList", JSON.stringify(Job.jobList.objectList, (key, value) => {
            if(value instanceof Job){
                return {
                    name: value.name,
                    points: TipsManager.moveDecimal(value.points,-2),
                    isServer: value.isServer,
                    id: value.id,
                    rate: value.rate
                };
            }
            return value;
        }, 2))
    }
    static buildState(){
        //console.log("saved jobs: ")
        //console.log(sessionStorage.getItem("jobList"))
        JSON.parse(sessionStorage.getItem("jobList"), (key, value) => {
            if(value && value.name) {
                value = new Job(value.name , TipsManager.standardizeValue(value.points), value.isServer, value.id)
            }
            return value
        })
        Job.updateCheckoutInputDisplay()
        //console.log("jobs: ")
        //console.log(getJobs())
    }
    static addListeners(){
        changeHandler.addElement("changedJobSelect", Job.updateCheckoutInputDisplay, Job.createEmployeeJobSelect)
        changeHandler.addElement("changedCreateFormIsServer", Job.createIsServerUpdate, document.getElementById("isServer"))
    }
    static formCreate(){
        if(!Job.validateJobForm()) return
        const fromData = new FormData(Job.createJobForm)
        const job = new Job(fromData.get("name"), TipsManager.standardizeValue(Number(fromData.get("points"))), fromData.get("isServer")!==null)
        Job.createJobForm.reset()
        Job.createJobForm.querySelector("input.checkbox").dispatchEvent(new Event("change", {bubbles : true}))
        const employeeRadio = document.getElementById("createForm").querySelector('input[value="Employee"]')
        employeeRadio.checked = true
        employeeRadio.dispatchEvent(new Event("change", {bubbles: true}))
        job.optionHTML.selected = true
        Job.updateCheckoutInputDisplay()
    }
    static validateJobForm(){
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
        return Job.jobList.objectList.find(job => job.optionHTML.selected)
    }
    static updateCheckoutInputDisplay(){
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

    static updateJobSelect(){
        const selectedJob = findSelectedOptionJob()
        const oldSelect = document.getElementById("createEmployeeForm").querySelector("select")
        const newSelect = oldSelect.cloneNode()
        Job.jobList.objectList.forEach(job => newSelect.appendChild(job.optionHTML))
        document.getElementById("createEmployeeForm").replaceChild(newSelect, oldSelect)
        selectedJob.optionHTML.selected = true
    }
    static compareJobs(a, b){
        return -numberCompare(a.points, b.points)
    }
    static getJobs(){
        return Job.jobList.objectList
    }
    isServerUpdate = () => {
        const label = this.updateForm.HTML.querySelector("label")
        const checkbox = this.updateForm.HTML.querySelector("input.checkbox")
        Job.setLabel(label, checkbox.checked)
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
        if(!checkFieldsFilled(this.updateForm.HTML, ["name", "points"])) return
        const form = new FormData(this.updateForm.HTML)
        this.name = form.get("name")
        this.points = TipsManager.standardizeValue(Number(form.get("points")))
        this.updateForm.HTML.querySelector("input[name='points']").value = TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.points,-2))
        this.isServer = form.get("isServer")!==null
        this.fillOptionWithThis(this.optionHTML)
        this.updateForm.closeEdit()
        Job.jobList.sort()
        Job.updateJobSelect()
        /*UPDATE SERVER LIST LOGIC*/
        updateEmployeeSelectElements()
        employeeUpdateList.sort()
        TipsManager.updateTips()
        Job.updateCheckoutInputDisplay()
    }
    deleteFunction = () => {
        if(Job.jobList.objectList.length === 1){
            console.log("must have at least one job")
            return
        }
        this.optionHTML.remove() //removing option from create employee select
        let ind = Math.min(Job.jobList.objectList.indexOf(this), Job.jobList.objectList.length-2)
        Job.jobList.removeItem(this)
        const newJob = Job.jobList.objectList[ind]
        if(this.optionHTML.selected) newJob.optionHTML.selected = true
        Job.updateJobSelect()
        /*UDATE EMPLOYEE JOBS*/
        getEmployees().forEach(emp => {
            if(emp.job.id === this.id) {
                newJob.employeeWorkHours += emp.hours
                emp.job = newJob
            }
        })
        updateEmployeeSelectElements() //removes option from employeeUpdateForms
        employeeUpdateList.sort()
        TipsManager.updateTips()
        Job.updateCheckoutInputDisplay()
    }
    setHTML(){
        this.optionHTML = document.createElement("option")
        this.optionHTML.setAttribute("data-job-option", String(this.id))
        this.fillOptionWithThis(this.optionHTML)
        this.optionHTML.selected = true


        const formHTML = Job.createJobForm.cloneNode(true)
        this.setFormWithThis(formHTML)
        this.updateForm = new UpdateForm(this.updateFunction, this.deleteFunction, this.fillFunction, "Job", this.id, formHTML)
        this.updateForm.HTML.setAttribute("class","jobUpdateForm")
        this.updateForm.HTML.classList.add("updateFormInputStyle")
        if(!UpdateForm.selectedUpdateForm) this.updateForm.HTML.dispatchEvent(new Event("click", {bubbles: true}))
        
    }
}
export const findSelectedOptionJob = Job.findSelectedOptionJob
export const getJobs = Job.getJobs
export default Job