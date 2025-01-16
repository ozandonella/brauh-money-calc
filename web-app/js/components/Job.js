import { checkFieldsFilled } from "./CreateController.js"
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
        this.listHTML = null
        this.setHTML()
        this.isAppended = false
        Job.jobCount++
    }
    static addListeners(){
        Job.createEmployeeJobSelect.addEventListener("change", Job.jobUpdate)
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
    static findSelected(){
        return Job.jobList.find(job => job.optionHTML.selected)
    }
    static jobUpdate(){
        const employeeCheckoutElements = document.querySelectorAll(".employeeCheckoutInput")
        if(Job.findSelected().isServer){
            employeeCheckoutElements.forEach(el => el.classList.remove("hidden"))
        }
        else{
            employeeCheckoutElements.forEach(el => el.classList.add("hidden"))
        }
    }
    append(){
        if(!this.isAppended){
            Job.createEmployeeJobSelect.append(this.optionHTML)
            document.getElementById("jobList").append(this.listHTML)
            Job.jobList.push(this)
            console.log("appended element")
        }
        else console.log("this job is already appended")
    }
    createFormFromThis(){
        const form = Job.createJobForm.cloneNode(true)
        form.id = null
        const formData = new FormData(form)
        formData.append("job", this.name)
        formData.append("points", this.points)
        for(const [name, value] of formData.entries()){
            form.querySelector("input[name='"+name+"']").value = value
        } 
        if (this.isServer) form.querySelector("input[type='checkbox']").checked = true
        

        return form
    }
    /*equalTo(otherJob){
        return Object.keys(this).every(key => this[key]===otherJob[key])
    }*/
    setHTML(){
        const jobOptionElement = document.createElement("option")
        jobOptionElement.setAttribute("value", this.name)
        jobOptionElement.setAttribute("id", "jobOption"+Job.jobCount)
        jobOptionElement.innerText=this.name + "(" +this.points +")"
        this.optionHTML = jobOptionElement

        const jobItemElement = document.createElement("li")
        jobItemElement.setAttribute("id", "jobListitem"+Job.jobCount)
        const editAndDelete = createEditAndDelete() 
        editAndDelete.querySelector(".editButton")
        editAndDelete.querySelector(".deleteButton")

        const displayEditAndDelete = (event) => {
            if(Job.selectedListItemJob&&Job.selectedListItemJob.listHTML.contains(event.target)) return
            editAndDelete.classList.remove("hidden")
            if(Job.selectedListItemJob) Job.selectedListItemJob.listHTML.querySelector(".editAndDelete").classList.add("hidden")
            Job.selectedListItemJob = this
        }
        jobItemElement.addEventListener("click", displayEditAndDelete)
        jobItemElement.addEventListener("touchend", displayEditAndDelete)
        
        const form = this.createFormFromThis()
        form.setAttribute("class", "form")
        form.classList.add("subForm")
        jobItemElement.append(form)
        jobItemElement.append(editAndDelete)
        this.listHTML = jobItemElement
    }
}
export default Job