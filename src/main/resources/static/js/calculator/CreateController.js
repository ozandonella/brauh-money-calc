import Job from "./Job.js";
import Employee from "./Employee.js";
import Checkout from "./Checkout.js";
import { selectedUpdateForm, unselectCurrentForm } from "./UpdateForm.js";
import {clickHandler, touchenedHandler} from "../util/EventHandler.js";

class CreateController{
    static sideListButton = document.getElementById("sideListButton")
    static confirmButton = document.getElementById("confirmButton")

    constructor(){
        CreateController.startScripts()
        
    }
    static startScripts(){
        clickHandler.appendTo(document.body)
        touchenedHandler.appendTo(document.body)
        clickHandler.addElement("clickCreateButton", CreateController.createFunction, document.getElementById("createButton"))
        clickHandler.addElement("clickChangeSideList", CreateController.displaySideList, document.getElementById("sideListButton"))
        clickHandler.addElement("clickConfirmButton", CreateController.confirmButtonPressed, document.getElementById("confirmButton"))
        touchenedHandler.addElement("touchCreateButton", CreateController.createFunction, document.getElementById("createButton"))
        touchenedHandler.addElement("touchChangeSideList", CreateController.displaySideList, document.getElementById("sideListButton"))
        touchenedHandler.addElement("touchConfirmButton", CreateController.confirmButtonPressed, document.getElementById("confirmButton"))
        document.addEventListener("keydown", event => {
            if(event.target.classList.contains("disabled")) event.preventDefault()
        })
        document.getElementById("createForm").addEventListener("change", CreateController.displayForm)
        const employeeRadio = document.getElementById("createForm").querySelector('input[value="Employee"]')
        employeeRadio.checked = true
        employeeRadio.dispatchEvent(new Event("change", {bubbles: true}))
        Job.addListeners()
        if(sessionStorage.getItem("state")) CreateController.buildState()
        else{
            Job.addBaseJobs()
            Checkout.addBaseCheckouts()
        }
    }
    static saveState(){
        sessionStorage.setItem("state", "true")
        const preview = document.getElementById("lists").cloneNode(true)
        preview.querySelector("#jobListContainer").remove()
        preview.querySelectorAll("button").forEach(el => el.remove())
        preview.querySelectorAll(".editAndDelete").forEach(el => el.remove())
        preview.querySelectorAll("p[class = '.editColumn']").forEach(el => el.remove())
        preview.querySelector("#employeeListHeader").setAttribute("id", "employeePreviewHeader")
        preview.querySelector("#checkoutListHeader").setAttribute("id", "checkoutPreviewHeader")
        preview.querySelectorAll(".employeeUpdateForm, .checkoutUpdateForm").forEach(el => {
            const updateData = new FormData(document.getElementById(el.getAttribute("id")))
            if(el.classList.contains("checkoutUpdateForm")){
                el.classList.remove("checkoutUpdateForm")
                el.classList.add("checkoutPreviewForm")
                el.querySelector("input[name = 'name']").setAttribute("value", updateData.get("name"))
                el.querySelector("input[name = 'amount']").setAttribute("value", updateData.get("amount"))
            }
            else{
                el.classList.remove("employeeUpdateForm")
                el.classList.add("employeePreviewForm")
                el.querySelector("input[name = 'name']").setAttribute("value", updateData.get("name"))
                el.querySelector("input[name = 'hours']").setAttribute("value", updateData.get("hours"))
                el.querySelector("option[value = '"+ updateData.get("job")+"']").setAttribute("selected", "selected")
            }
        })
        console.log(preview)    
        sessionStorage.setItem("preview", preview.innerHTML)
    }
    static buildState(){
        Job.buildState()
        Checkout.buildState()
        Employee.buildState()
    }
    static confirmButtonPressed(){
        unselectCurrentForm()
        CreateController.saveState()
        window.location.href = "confirm.html"
    }
    static displaySideList(){
        const button = document.getElementById("sideListButton")
        const jobContainer = document.getElementById("jobListContainer")
        const checkoutContainer = document.getElementById("checkoutListContainer")
        unselectCurrentForm()
        if(jobContainer.classList.contains("hidden")){
            checkoutContainer.classList.add("hidden")
            jobContainer.classList.remove("hidden")
            button.innerText = "Show Checkouts"
        }
        else{
            jobContainer.classList.add("hidden")
            checkoutContainer.classList.remove("hidden")
            button.innerText = "Show Jobs"
        }
    }
    static displayForm(event){
        unselectCurrentForm()
        if(event.target.name!=="createRadio") return
        const divName = "create"+event.target.value+"Form"
        document.querySelectorAll("#header .subForm").forEach(el=>{
            if(el.id===divName){
                el.classList.remove("hidden")
                el.querySelector("input").focus()
            }
            else(el.classList.add("hidden"))
        }) 
    }
    static createFunction(){
        unselectCurrentForm()
        const createFormElement = document.getElementById("createForm")
        if(!checkFieldsFilled(createFormElement, ["createRadio"])) return
        const createTarget = new FormData(createFormElement).get("createRadio")
        let objClass = Employee
        if(createTarget === "Checkout") objClass = Checkout
        else if(createTarget === "Job") objClass = Job
        objClass.formCreate()
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
export const displayConfirmButton = () => {
    if(Employee.employeeList.length === 0) CreateController.confirmButton.classList.add("hidden")
    else CreateController.confirmButton.classList.remove("hidden")  
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