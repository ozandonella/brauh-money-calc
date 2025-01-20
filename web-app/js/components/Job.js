import { checkFieldsFilled, getIconElement } from "./CreateController.js"
import { createEditAndDelete } from "./CreateController.js"
class Job{
    static jobCount = 0
    static jobList = []
    static createJobForm = document.getElementById("createJobForm")
    static selectedListItemJob = null
    static createEmployeeJobSelect = document.getElementById("createEmployeeForm").querySelector("select")
    constructor(name, points, isServer){
        this.name = name
        this.points = points
        this.isServer = isServer
        this.optionHTML = null
        this.updateFormHTML = null
        this.setHTML()
        this.isAppended = false
        Job.jobCount++
    }
    static addListeners(){
        Job.createEmployeeJobSelect.addEventListener("change", Job.jobUpdate)
        document.getElementById("isServer").addEventListener("change", Job.isServerUpdate)
    }
    static formCreate(){
        if(!Job.validateJobForm()) return
        const fromData = new FormData(Job.createJobForm)
        new Job(fromData.get("job"), fromData.get("points"), fromData.get("isServer")).append()
        Job.createEmployeeJobSelect.selectedIndex = Job.createEmployeeJobSelect.options.length - 1
        Job.createJobForm.reset()
        const employeeRadio = document.getElementById("createForm").querySelector('input[value="Employee"]')
        employeeRadio.checked = true
        employeeRadio.dispatchEvent(new Event("change", {bubbles: true})) 
    }
    static validateJobForm(){
        if(!checkFieldsFilled(Job.createJobForm, ["job", "points"])){
            console.log("job must have name and point value")
            return false
        }
        return true
    }
    static addBaseJobs(){
        new Job("Server", 4.0, true).append()
        new Job("Bar", 4.0, false).append()
        new Job("Host", 4.0, false).append()
        new Job("CH", 1.75, false).append()
        new Job("BBK", 1.75, false).append()
        new Job("Busser", 1.5, false).append()
    }
    static findSelectedOptionJob(){
        return Job.jobList.find(job => job.optionHTML.selected)
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
    append(){
        if(!this.isAppended){
            Job.createEmployeeJobSelect.append(this.optionHTML)
            document.getElementById("jobList").append(this.updateFormHTML)
            Job.jobList.push(this)
        }
        else console.log("this job is already appended")
    }
    createFormFromThis(){
        const form = Job.createJobForm.cloneNode(true)
        form.id = ""
        form.className = ""
        const formData = new FormData(form)
        formData.append("job", this.name)
        formData.append("points", this.points)
        for(const [name, value] of formData.entries()){
            form.querySelector("input[name='"+name+"']").value = value
        }
        const checkbox = form.querySelector("input.checkbox")

        checkbox.id += "List" + Job.jobCount
        checkbox.addEventListener("change", Job.isServerUpdate)
        const label = form.querySelector("label.checkbox")
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
        return form
    }
    setThisFormDisabled(isDisabled){
        for(const el of this.updateFormHTML.querySelectorAll("label, input, div")) isDisabled ? el.classList.add("disabled") : el.classList.remove("disabled")
    }
    /*equalTo(otherJob){
        return Object.keys(this).every(key => this[key]===otherJob[key])
    }*/
    displayCheckAndClose(event){

    }
    updateListItem(event){

    }
    deleteListItem(event){

    }
    selectListItem(event){
        if(Job.selectedListItemJob&&Job.selectedListItemJob.updateFormHTML.contains(event.target)) return
        const editAndDelete = this.updateFormHTML.querySelector(".editAndDelete")
        this.updateFormHTML.classList.add("selectedListItem")
        editAndDelete.classList.remove("disabled")
        //this.setThisFormDisabled(false)
        //editAndDelete.classList.remove("hidden")
        if(Job.selectedListItemJob){
            Job.selectedListItemJob.updateFormHTML.classList.remove("selectedListItem")
            Job.selectedListItemJob.setThisFormDisabled(true)
            //Job.selectedListItemJob.updateFormHTML.querySelector(".editAndDelete").classList.add("hidden")
        } 
        Job.selectedListItemJob = this
    }
    setHTML(){
        const jobOptionElement = document.createElement("option")
        jobOptionElement.setAttribute("value", this.name)
        jobOptionElement.setAttribute("id", "jobOption"+Job.jobCount)
        jobOptionElement.innerText=this.name + "(" +this.points +")"
        this.optionHTML = jobOptionElement

        const jobUpdateFormElement = this.createFormFromThis()
        jobUpdateFormElement.setAttribute("id", "jobUpdateForm"+Job.jobCount)
        const editAndDelete = createEditAndDelete()


        editAndDelete.querySelector(".editButton")
        editAndDelete.querySelector(".deleteButton")
        
        
        jobUpdateFormElement.classList.add("listForm")
        jobUpdateFormElement.append(editAndDelete)
        this.updateFormHTML = jobUpdateFormElement
        this.setThisFormDisabled(true)
        jobUpdateFormElement.addEventListener("click", this.selectListItem.bind(this))
        jobUpdateFormElement.addEventListener("touchend", this.selectListItem.bind(this))
        if(!Job.selectedListItemJob) jobUpdateFormElement.dispatchEvent(new Event("click", {bubbles: true}))
        
    }
}
export default Job