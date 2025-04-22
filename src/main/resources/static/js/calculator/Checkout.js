import {checkFieldsFilled} from "./CreateController.js"
import TipsManager from "./TipsManager.js"
import UpdateForm from "./UpdateForm.js"
class Checkout{
    static checkoutCount = 0
    static createCheckoutForm = document.getElementById("createCheckoutForm")
    static checkoutList = []
    constructor(name, amount){
        this.name = name
        this.amount = amount
        this.id = Checkout.checkoutCount
        this.updateForm = null
        this.setHTML()
        Checkout.checkoutList.push(this)
        Checkout.checkoutCount++
        TipsManager.updateTips()
    }
    static saveState(){
        sessionStorage.setItem("checkoutList", JSON.stringify(Checkout.checkoutList, (key, value) => {
            if(value instanceof Checkout){
                return {
                    name: value.name,
                    amount: TipsManager.moveDecimal(value.amount, -2)
                }
            }
            return value
        }, 2))
    }
    static buildState(){
        JSON.parse(sessionStorage.getItem("checkoutList"), (key, value) => {
            if(value && value.name) return new Checkout(value.name, TipsManager.standardizeValue(value.amount))
            return value
        })
    }
    static formCreate(){
        const checkoutFormElement = document.getElementById("createCheckoutForm")
        if(!checkFieldsFilled(checkoutFormElement, ["name","amount"])) return
        const formData = new FormData(Checkout.createCheckoutForm)
        new Checkout(formData.get("name"), TipsManager.standardizeValue(Number(formData.get("amount"))))
        Checkout.createCheckoutForm.reset()
        console.log("checkout created")
    }
    static addBaseCheckouts(){
        new Checkout("Bar Cash", 0)
        new Checkout("Server Cash", 0)
    }
    static getCreateForm(){
        return Checkout.createCheckoutForm
    }
    updateFunction = () => {
        if(!checkFieldsFilled(this.updateForm.HTML, ["name","amount"])) return
        this.name = this.updateForm.HTML.querySelector("input[name='name']").value
        this.amount = TipsManager.standardizeValue(Number(this.updateForm.HTML.querySelector("input[name='amount']").value))
        this.updateForm.HTML.querySelector("input[name='amount']").value = TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.amount, -2))
        this.updateForm.closeEdit()
        TipsManager.updateTips()
    }
    deleteFunction = () => {
        this.updateForm.HTML.remove()
        let ind = Checkout.checkoutList.indexOf(this)
        Checkout.checkoutList.splice(ind, 1)
        if(Checkout.checkoutList.length > 0) Checkout.checkoutList[Math.min(ind,Checkout.checkoutList.length-1)].updateForm.select()
        TipsManager.updateTips()
    }
    fillFunction = () => {
        this.updateForm.HTML.querySelector("input[name='name']").value = this.name
        this.updateForm.HTML.querySelector("input[name='amount']").value = TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.amount, -2))
    }
    setFormWithThis(checkoutFormElement){
        checkoutFormElement.id = "Checkout"+this.id
        checkoutFormElement.querySelector("input[name='name']").value = this.name
        checkoutFormElement.querySelector("input[name='amount']").value = TipsManager.getHundredthsRep(TipsManager.moveDecimal(this.amount, -2))
    }
    setHTML(){
        const formHTML = Checkout.createCheckoutForm.cloneNode(true)
        this.setFormWithThis(formHTML)
        this.updateForm = new UpdateForm(this.updateFunction, this.deleteFunction, this.fillFunction, "Checkout", this.id, formHTML)
        this.updateForm.HTML.setAttribute("class", "checkoutUpdateForm")
        this.updateForm.HTML.classList.add("updateFormInputStyle")
        document.getElementById("checkoutList").append(this.updateForm.HTML)
    }
}
export let checkoutList = Checkout.checkoutList
export default Checkout