import UpdateForm from "./UpdateForm.js";
import Job from "./Job.js";
import Employee from "./Employee.js";
import Checkout from "./Checkout.js";
import {updateFormHandler} from "./EventHandler.js";
class CreateController{
    constructor(){
        CreateController.startScripts()
        
    }
    static startScripts(){
        updateFormHandler.appendTo(document.getElementById("lists"))
        console.log(UpdateForm.UpdateFormHandler)
        document.getElementById("createButton").addEventListener("click", CreateController.createFunction)
        document.getElementById("createButton").addEventListener("touchend", CreateController.createFunction)
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
        document.querySelectorAll("#header .subForm").forEach(el=>{
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
    static preventInteraction = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }
}
export const getIconElement = (className, iconName) => {
    const icon = document.createElement("span")
    icon.setAttribute("class", className)
    icon.innerText = iconName
    return icon
}
export const preventInteraction = CreateController.preventInteraction 
export const checkFieldsFilled = CreateController.checkFieldsFilled
export default CreateController