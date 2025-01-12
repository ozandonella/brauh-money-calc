import { checkFieldsFilled } from "./CreateController.js"
import { createEditAndDelete } from "./CreateController.js"
class Job{
    static jobCount = 0
    static jobList = []
    static createJobForm = document.getElementById("createJobForm")
    static selectedListItemJob = null
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
        document.getElementById("employeeJob").addEventListener("change", Job.jobUpdate)
    }
    static formCreate(){
        if(!Job.validateJobForm()) return
        const fromData = new FormData(Job.createJobForm)
        new Job(fromData.get("job"), fromData.get("points"), fromData.get("isServer")).append()

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
        const employeeCheckoutElement = document.getElementById("employeeCheckout")
        const employeeCheckoutLabelElement = document.getElementById("employeeCheckoutLabel")
        console.log(Job.findSelected())
        if(Job.findSelected().isServer){
            employeeCheckoutElement.classList.remove("hidden")
            employeeCheckoutLabelElement.classList.remove("hidden")
        }
        else{
            employeeCheckoutElement.classList.add("hidden")
            employeeCheckoutLabelElement.classList.add("hidden")
        }
    }
    append(){
        if(!this.isAppended){
            document.getElementById("employeeJob").append(this.optionHTML)
            document.getElementById("jobList").append(this.listHTML)
            Job.jobList.push(this)
            console.log("appended element")
        }
        else{
            document.getElementById("employeeJob").append(this.optionHTML)
        }
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
    
        const form = document.createElement("form")
        form.setAttribute("class", "editJobForm")
        const nameInput = document.createElement("input")
        nameInput.setAttribute("value", this.name)
        nameInput.setAttribute("type", "text")
        nameInput.setAttribute("placeholder", "Job Desc")

        const pointInput = document.createElement("input")
        pointInput.setAttribute("value", this.points)
        pointInput.setAttribute("type", "number")
        pointInput.setAttribute("placeholder", "0.0")

        const isServerInput = document.createElement("input")
        isServerInput.setAttribute("type", "checkbox")
        isServerInput.checked = this.isServer
        form.append(nameInput)
        form.append(pointInput)
        form.append(isServerInput)
        jobItemElement.append(form)
        jobItemElement.append(editAndDelete)
        this.listHTML = jobItemElement
    }
}
export default Job