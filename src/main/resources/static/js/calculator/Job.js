import {checkFieldsFilled} from "./CreateController.js"
import UpdateForm from "./UpdateForm.js"
import {employeeList} from "./Employee.js"
import TipsManager from "./TipsManager.js";
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
    
    static addListeners(){
        Job.createEmployeeJobSelect.addEventListener("change", Job.jobUpdate)
        document.getElementById("isServer").addEventListener("change", Job.isServerUpdate)
    }
    static formCreate(){
        if(!Job.validateJobForm()) return
        const fromData = new FormData(Job.createJobForm)
        new Job(fromData.get("name"), fromData.get("points"), fromData.get("isServer"))
        Job.createEmployeeJobSelect.selectedIndex = Job.createEmployeeJobSelect.options.length - 1
        Job.createJobForm.reset()
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
        new Job("Server", 4.0, true)
        new Job("Bar", 4.0, false)
        new Job("Host", 4.0, false)
        new Job("CH", 1.75, false)
        new Job("BBK", 1.75, false)
        new Job("Busser", 1.5, false)
    }
    static findSelectedOptionJob(){
        return Job.jobList.find(job => job.optionHTML.selected)
    }
    static findJobByID(id){

    }
    static jobUpdate(){
        const employeeCheckoutElements = document.querySelectorAll(".employeeCheckoutInput")
        if(Job.findSelectedOptionJob().isServer){
            employeeCheckoutElements.forEach(el => el.classList.remove("hidden"))
        }
        else{
            employeeCheckoutElements.forEach(el => el.classList.add("hidden"))
        }
    }
    static isServerUpdate(event){
        var text = ""
        if(Job.createJobForm.contains(event.target)) text = "Server: "
        const label = document.getElementById(event.target.id + "Label")
        if(event.target.checked){
            text += "yes"
            label.classList.add("checked")
        }
        else{
            text += "no"
            label.classList.remove("checked")
        }
       label.innerText = text
    }
    static printWorkHours(){
        jobList.forEach((job) => console.log(job.name +" "+job.employeeWorkHours))
    }
    static getCreateForm(){
        return Job.createJobForm
    }
    fillOptionWithThis(jobOptionHtml){
        jobOptionHtml.innerText = this.name+"("+this.points+")"
        jobOptionHtml.value=this.name
    }
    setFormWithThis(jobFormElement){
        jobFormElement.id = "Job" +this.id
        const formData = new FormData(jobFormElement)
        formData.append("name", this.name)
        formData.append("points", this.points)
        for(const [name, value] of formData.entries()){
            jobFormElement.querySelector("input[name='"+name+"']").value = value
        }
        const checkbox = jobFormElement.querySelector("input.checkbox")

        checkbox.id += "List" + Job.jobCount
        checkbox.addEventListener("change", Job.isServerUpdate)
        const label = jobFormElement.querySelector("label.checkbox")
        label.setAttribute("for", checkbox.id)
        label.setAttribute("id", checkbox.id + "Label")
        if(this.isServer){
            checkbox.checked = true
            label.innerText = "yes"
            label.classList.add("checked")
        }
        else{
            checkbox.checked = false
            label.innerText = "no"
            label.classList.remove("checked")
        }
    }
    updateEmployeeWorkHours(){
        
    }
    fillFunction = () => {
        this.updateForm.HTML.querySelector("input[name='name']").value = this.name
        this.updateForm.HTML.querySelector("input[name='points']").value = this.points
        const checkbox = this.updateForm.HTML.querySelector("input.checkbox")
        const label = this.updateForm.HTML.querySelector("label.checkbox")
        if(this.isServer){
            checkbox.checked = true
            label.innerText = "yes"
            label.classList.add("checked")
        }
        else{
            checkbox.checked = false
            label.innerText = "no"
            label.classList.remove("checked")
        }
    }
    updateFunction = () => {
        const form = new FormData(this.updateForm.HTML)
        for(const [key, value] of form.entries()){
            this[key] = value
            console.log(key)
        }
        this.isServer = this.updateForm.HTML.querySelector("input.checkbox").checked
        this.fillOptionWithThis(this.optionHTML)
        /*UPDATE SERVER LIST LOGIC*/
        employeeList.forEach((employee) => {
            const currOption = employee.updateForm.HTML.querySelector("[data-job-option = '"+this.id+"']")
            currOption.innerText = this.name + "(" + this.points + ")"
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
                employee.job = Job.jobList.find((job) => job.id == currSelect.selectedOptions[0].dataset.jobOption)
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
        const createJobOptionFromthis = () => {
            const option = document.createElement("option")
            option.setAttribute("data-job-option", this.id)
            this.fillOptionWithThis(option)
            return option
        }
        employeeList.forEach((employee) => employee.updateForm.HTML.querySelector("select").append(createJobOptionFromthis()))
        const jobOptionElement = createJobOptionFromthis()
        this.optionHTML = jobOptionElement

        this.updateForm = new UpdateForm(this.updateFunction, this.deleteFunction, this.fillFunction, "Job", this.id, Job.createJobForm.cloneNode(true))
        this.setFormWithThis(this.updateForm.HTML)
        this.updateForm.HTML.setAttribute("class","jobUpdateForm")
        this.updateForm.HTML.classList.add("updateFormInputStyle")        
        document.getElementById("jobList").append(this.updateForm.HTML)
        if(!UpdateForm.selectedUpdateForm) this.updateForm.HTML.dispatchEvent(new Event("click", {bubbles: true}))
        
    }
}
export const findSelectedOptionJob = Job.findSelectedOptionJob
export const jobList = Job.jobList
export default Job