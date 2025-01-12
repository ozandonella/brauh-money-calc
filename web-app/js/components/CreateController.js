import Job from "./Job.js";
import Employee from "./Employee.js";
import Checkout from "./Checkout.js";
class CreateController{
    constructor(){
        CreateController.startScripts()
        
    }
    static startScripts(){
        document.getElementById("createButton").addEventListener("click", CreateController.createFunction)
        document.getElementById("createForm").addEventListener("change", CreateController.displayCreationData)
        document.getElementById("employeeJob").addEventListener("change", CreateController.jobUpdate)
        document.getElementById("employeeName").addEventListener("input", CreateController.copyEmployeeNameToCheckout)
        Job.addListeners()
        Job.addBaseJobs()
    }
    static displayCreationData(event){
        if(event.target.name!=="createRadio") return
        const divName = "create"+event.target.value+"Div"
        document.querySelectorAll(".createFormData").forEach(el=>{
            if(el.id===divName) el.classList.remove("hidden")
            else(el.classList.add("hidden"))
        }) 
    }
    static createFunction(){
        const createFormElement = document.getElementById("createForm")
        if(!checkFieldsFilled(createFormElement, ["createRadio"])) return
        const createTarget = new FormData(createFormElement).get("createRadio")
        if(createTarget==="Employee") Employee.formCreate()
        else if(createTarget==="Job") Job.formCreate()
        else Checkout.createCheckout()
    }
    static checkFieldsFilled(formElement, fieldNames){
        const formData = new FormData(formElement)
        for(const name of fieldNames) if(!formData.get(name)) return false
        return true
    }
}
export const createEditAndDelete = () => {
    const container = document.createElement("div")
    container.classList.add("editAndDelete")
    container.classList.add("hidden")

    const deleteButton = document.createElement("button")
    deleteButton.setAttribute("class", "deleteButton")
    deleteButton.setAttribute("type", "button")
    deleteButton.innerText = "del"

    const editButton = document.createElement("button")
    deleteButton.setAttribute("class", "editButton")
    editButton.setAttribute("type", "button")
    editButton.innerText = "edit"
    container.append(editButton) 
    container.append(deleteButton)
    return container
}
export const createDoneAndCancel = () => {
    const container = document.createElement("div")
    container.classList.add("doneAndCancel")
    container.classList.add("hidden")

    const doneButton = document.createElement("button")
    doneButton.setAttribute("class", "doneButton")
    doneButton.setAttribute("type", "button")
    doneButton.innerText = "done"

    const cancelButton = document.createElement("button")
    doneButton.setAttribute("class", "cancelButton")
    cancelButton.setAttribute("type", "button")
    cancelButton.innerText = "cancel"
    container.append(cancelButton) 
    container.append(doneButton)
    return container
}
export const checkFieldsFilled = CreateController.checkFieldsFilled
export default CreateController