import {checkFieldsFilled} from "./CreateController.js"
import UpdateForm from "./UpdateForm.js"
class Job{
    static jobCount = 0
    static jobList = []
    static makingEditToList = false
    static createJobForm = document.getElementById("createJobForm")
    static createEmployeeJobSelect = document.getElementById("createEmployeeForm").querySelector("select")
    constructor(name, points, isServer){
        this.id = Job.jobCount
        this.name = name
        this.points = points
        this.isServer = isServer
        this.optionHTML = null
        this.updateForm = null
        
        this.setHTML()
        Job.createEmployeeJobSelect.append(this.optionHTML)
        document.getElementById("jobList").append(this.updateForm.HTML)
        Job.jobList.push(this)
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
        this.updateForm.closeEdit()
        console.log(Job.jobList)
        Job.jobUpdate()
    }
    deleteFunction = () => {
        if(Job.jobList.length===1){
            console.log("must have at least one job")
            return
        }
        this.optionHTML.remove()
        this.updateForm.HTML.remove()
        /*UDATE EMPLOYEE JOBS*/

        if(!Job.findSelectedOptionJob()) Job.createEmployeeJobSelect.selectedIndex=0;
        var ind = Job.jobList.indexOf(this)
        Job.jobList.splice(ind, 1)
        ind = Math.min(ind, Job.jobList.length-1)
        Job.jobList[ind].updateForm.select()
        Job.jobUpdate()
    }
    setHTML(){
        const createJobOptionFromthis = () => {
            const option = document.createElement("option")
            option.setAttribute("data-job-option", this.id)
            this.fillOptionWithThis(option)
            return option

            /*
            WAS HERE 1/22

            working on creating a way to update all job option elements in the dom 
            (employee update form select elements and employee create form select)
            */
        }

        const jobOptionElement = createJobOptionFromthis()
        this.optionHTML = jobOptionElement

        this.updateForm = new UpdateForm(this.updateFunction, this.deleteFunction, this.fillFunction, "Job", this.id, Job.createJobForm.cloneNode(true))
        this.setFormWithThis(this.updateForm.HTML)
        this.updateForm.HTML.setAttribute("class","updateForm")
        
        
        if(!UpdateForm.selectedUpdateForm) this.updateForm.HTML.dispatchEvent(new Event("click", {bubbles: true}))
        
    }
}
export const findSelectedOptionJob = Job.findSelectedOptionJob
export default Job