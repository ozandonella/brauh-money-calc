import Job from "./Job.js";
import Employee from "./Employee.js";
import Checkout from "./Checkout.js";
class CreateController{
    constructor(){
        CreateController.startScripts()
        
    }
    static startScripts(){
        document.getElementById("createButton").addEventListener("click", CreateController.createFunction)
        document.getElementById("createForm").addEventListener("change", CreateController.displayForm)
        const employeeRadio = document.getElementById("createForm").querySelector('input[value="Employee"]')
        employeeRadio.checked = true
        employeeRadio.dispatchEvent(new Event("change", {bubbles: true}))
        Job.addListeners()
        Job.addBaseJobs()
    }
    static displayForm(event){
        if(event.target.name!=="createRadio") return
        const divName = "create"+event.target.value+"Form"
        document.querySelectorAll(".subForm").forEach(el=>{
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
export const createFormForList = (formElement) => {
    const form = formElement.cloneNode(true)
    form.id = null
    
    form.classList.add("")
} 
export const createButtonForList = (name) => {
    const button = document.createElement("button")
    button.setAttribute("class", name+"Button")
    button.setAttribute("type", "button")
    button.innerText = name
    return button
}
export const createEditAndDelete = () => {
    const container = document.createElement("div")
    container.classList.add("editAndDelete")
    container.classList.add("hidden")

    const deleteButton = createButtonForList("del")
    const editButton = createButtonForList("edit")

    container.append(editButton) 
    container.append(deleteButton)
    return container
}
export const createDoneAndCancel = () => {
    const container = document.createElement("div")
    container.classList.add("doneAndCancel")
    container.classList.add("hidden")

    const doneButton = createButtonForList("done")
    const cancelButton = createButtonForList("cancel")

    container.append(doneButton) 
    container.append(cancelButton)
    return container
}
export const checkFieldsFilled = CreateController.checkFieldsFilled
export default CreateController