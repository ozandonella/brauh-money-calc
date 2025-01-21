import { checkFieldsFilled, setChildrenDisabled, createEditAndDelete, setElementDisabled, createCheck } from "./CreateController.js"
class Job{
    static jobCount = 0
    static jobList = []
    static makingEditToList = false
    static createJobForm = document.getElementById("createJobForm")
    static selectedListItemJob = null
    static createEmployeeJobSelect = document.getElementById("createEmployeeForm").querySelector("select")
    constructor(name, points, isServer){
        this.name = name
        this.points = points
        this.isServer = isServer
        this.optionHTML = null
        this.updateFormHTML = null
        this.employeeParents = []
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
        if(!checkFieldsFilled(Job.createJobForm, ["name", "points"])){
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
    setOptionWithThis(jobOptionHtml){
        jobOptionHtml.innerText = this.name+"("+this.points+")"
        jobOptionHtml.value=this.name
    }
    setFormWithThis(jobFormElement){
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
        return jobFormElement
    }
    /*equalTo(otherJob){
        return Object.keys(this).every(key => this[key]===otherJob[key])
    }*/
    resetListItem(){
        
    }
    editListItem(event){
        const editAndDelete = this.updateFormHTML.querySelector(".editAndDelete")
        editAndDelete.classList.add("hidden")
        const check = this.updateFormHTML.querySelector(".checkButton")
        check.classList.remove("hidden")
        this.updateFormHTML.classList.add("editing")
        setChildrenDisabled(this.updateFormHTML, false)
        this.displayListButtons(true)
        this.updateFormHTML.querySelector("input").focus()

        event.stopPropagation()
    }
    updateListItem(event){
        const form = new FormData(this.updateFormHTML)
        console.log(this.updateFormHTML)
        for(const [key, value] of form.entries()){
            this[key] = value
            console.log(key)
        }
        this.isServer = this.updateFormHTML.querySelector("input.checkbox").checked
        this.displayListButtons(false)
        this.updateFormHTML.classList.remove("editing")
        setChildrenDisabled(this.updateFormHTML, true)
        setElementDisabled(this.updateFormHTML.querySelector(".editAndDelete", false))

        this.setOptionWithThis(this.optionHTML)
        Job.jobUpdate()

        /*UPDATE SERVER LIST LOGIC*/
        event.stopPropagation()
        console.log(Job.jobList)
    }
    deleteListItem(event){
        if(Job.jobList.length===1){
            console.log("must have at least one job")
            return
        }
    
        this.optionHTML.remove()
        this.updateFormHTML.remove()

        if(!Job.findSelectedOptionJob()) Job.createEmployeeJobSelect.selectedIndex=0;
        var ind = Job.jobList.indexOf(this)
        Job.jobList.splice(ind, 1)
        ind = Math.min(ind, Job.jobList.length-1)
        Job.jobList[ind].selectListItem()
        event.stopPropagation()
        /*UDATE EMPLOYEE JOBS*/

    }
    selectListItem(event){
        if(Job.selectedListItemJob===this){ 
            console.log("cant select same job")
            return
        }
        console.log(this)
        const editAndDelete = this.updateFormHTML.querySelector(".editAndDelete")
        this.updateFormHTML.classList.add("selectedListItem")
        setElementDisabled(editAndDelete, false)
        setChildrenDisabled(editAndDelete, false)
        if(Job.selectedListItemJob){
            Job.selectedListItemJob.updateFormHTML.classList.remove("selectedListItem")
            if(Job.selectedListItemJob.updateFormHTML.classList.contains("editing")){
                console.log("lost focus while editing")
                Job.selectedListItemJob.setFormWithThis(Job.selectedListItemJob.updateFormHTML)
                Job.selectedListItemJob.updateFormHTML.classList.remove("editing")
                Job.selectedListItemJob.displayListButtons(false)
            }
            setChildrenDisabled(Job.selectedListItemJob.updateFormHTML, true)
            setChildrenDisabled(Job.selectedListItemJob.updateFormHTML.querySelector(".editAndDelete"), true)
        } 
        Job.selectedListItemJob = this
    }
    displayListButtons(isCheck){
        if(isCheck){
            this.updateFormHTML.querySelector(".editAndDelete").classList.add("hidden")
            this.updateFormHTML.querySelector(".checkButton").classList.remove("hidden")
        }
        else{
            this.updateFormHTML.querySelector(".editAndDelete").classList.remove("hidden")
            this.updateFormHTML.querySelector(".checkButton").classList.add("hidden")
        }
    }
    setHTML(){
        const jobOptionElement = document.createElement("option")
        this.setOptionWithThis(jobOptionElement)
        jobOptionElement.setAttribute("id", "jobOption"+Job.jobCount)
        this.optionHTML = jobOptionElement

        const jobUpdateFormElement = this.setFormWithThis(Job.createJobForm.cloneNode(true))
        jobUpdateFormElement.className = ""
        jobUpdateFormElement.setAttribute("id", "jobUpdateForm"+Job.jobCount)
        const editAndDelete = createEditAndDelete()
        const check = createCheck()
        check.classList.add("hidden")

        const edit = editAndDelete.querySelector(".editButton")
        const del = editAndDelete.querySelector(".deleteButton")
        
        
        jobUpdateFormElement.classList.add("listForm")
        jobUpdateFormElement.append(editAndDelete)
        jobUpdateFormElement.append(check)

        this.updateFormHTML = jobUpdateFormElement
        setChildrenDisabled(this.updateFormHTML, true)
        del.addEventListener("click", this.deleteListItem.bind(this))
        check.addEventListener("click", this.updateListItem.bind(this))
        edit.addEventListener("click", this.editListItem.bind(this))
        edit.addEventListener("touchend", this.editListItem.bind(this))
        jobUpdateFormElement.addEventListener("click", this.selectListItem.bind(this))
        jobUpdateFormElement.addEventListener("touchend", this.selectListItem.bind(this))
        if(!Job.selectedListItemJob) jobUpdateFormElement.dispatchEvent(new Event("click", {bubbles: true}))
        
    }
}
export default Job