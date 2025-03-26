import { getIconElement } from "./CreateController.js"
import { clickHandler, touchenedHandler} from "../util/EventHandler.js"
class UpdateForm{
    static selectedUpdateForm
    constructor(updateFunction, deleteFunction, fillFunction, className, id,  formElement){
        this.className = className
        this.id = id
        this.fillFunction = fillFunction
        this.updateFunction = updateFunction
        this.deleteFunction = deleteFunction
        this.HTML = formElement
        this.build()
    }
    build(){
        this.editAndDeleteHTML = document.createElement("div")
        this.editAndDeleteHTML.classList.add("editAndDelete")
        
        this.updateButtonHTML = UpdateForm.createUpdateFormButton(getIconElement("material-symbols-outlined", "check"))
        this.updateButtonHTML.classList.add("hidden")
        
        const deleteButton = UpdateForm.createUpdateFormButton(getIconElement("material-symbols-outlined", "delete"))
        const editButton = UpdateForm.createUpdateFormButton(getIconElement("material-symbols-outlined", "edit"))
        
        this.editAndDeleteHTML.append(editButton) 
        this.editAndDeleteHTML.append(deleteButton)
        
        this.HTML.prepend(this.editAndDeleteHTML)
        this.HTML.prepend(this.updateButtonHTML)

        clickHandler.addElement("check"+this.className+this.id, this.updateFunction, this.updateButtonHTML)
        clickHandler.addElement("delete"+this.className+this.id, this.deleteFunction, deleteButton)
        clickHandler.addElement("edit"+this.className+this.id, this.openEdit, editButton)
        clickHandler.addElement("select"+this.className+this.id, this.select, this.HTML)
        
        touchenedHandler.addElement("check"+this.className+this.id, this.updateFunction, this.updateButtonHTML)
        touchenedHandler.addElement("delete"+this.className+this.id, this.deleteFunction, deleteButton)
        touchenedHandler.addElement("edit"+this.className+this.id, this.openEdit, editButton)
        touchenedHandler.addElement("select"+this.className+this.id, this.select, this.HTML)

        UpdateForm.setChildrenDisabled(this.HTML, true)
    }
   
    select = () => {
        if(UpdateForm.selectedUpdateForm === this){
            this.unselect()
            return
        }
        if(UpdateForm.selectedUpdateForm) UpdateForm.selectedUpdateForm.unselect()
        this.HTML.classList.add("selectedListForm")
        UpdateForm.selectedUpdateForm = this
        UpdateForm.setElementDisabled(this.editAndDeleteHTML, false)
    }
    unselect() {
        this.HTML.classList.remove("selectedListForm")
        UpdateForm.selectedUpdateForm = null
        if(this.HTML.classList.contains("editing")){ 
            this.closeEdit()
            this.fillFunction()
        }
        UpdateForm.setChildrenDisabled(this.HTML, true)
    }
    openEdit = () => {
        this.HTML.classList.add("editing")
        UpdateForm.setChildrenDisabled(this.HTML, false)
        this.displayButton(true)
        this.HTML.querySelector("input").focus()
    }
    closeEdit(){
        this.HTML.classList.remove("editing")
        this.displayButton(false)
        UpdateForm.setChildrenDisabled(this.HTML, true)
        UpdateForm.setElementDisabled(this.editAndDeleteHTML, false)
    }
    displayButton(isCheck){
        if(isCheck){
            this.editAndDeleteHTML.classList.add("hidden")
            this.updateButtonHTML.classList.remove("hidden")
        }
        else{
            this.editAndDeleteHTML.classList.remove("hidden")
            this.updateButtonHTML.classList.add("hidden")
        }
    }
    static unselectCurrentForm(){
        if(UpdateForm.selectedUpdateForm) UpdateForm.selectedUpdateForm.unselect()
    }
    static createUpdateFormButton(iconElement){
        const button = document.createElement("button")
        button.append(iconElement)
        button.setAttribute("class", iconElement.innerText+"Button")
        button.setAttribute("type", "button")
        return button
    }
    static setElementDisabled(element, isDisabled){
        if(isDisabled) element.classList.add("disabled")
        else element.classList.remove("disabled")  
    }
    static setChildrenDisabled(element, isDisabled){
        for(const el of Array.from(element.children)) UpdateForm.setElementDisabled(el, isDisabled)
    }
}
export const selectedUpdateForm = UpdateForm.selectedUpdateForm
export const unselectCurrentForm = UpdateForm.unselectCurrentForm
export default UpdateForm