import {checkFieldsFilled} from "../util/UtilityFunctions.js"
import TipsManager from "./TipsManager.js"
import UpdateForm from "../util/UpdateForm.js"
import UpdateList from "../util/UpdateList.js";
class Checkout{
    static checkoutCount = 0
    static createCheckoutForm = document.getElementById("createCheckoutForm")
    static checkoutList = new UpdateList([], document.getElementById("checkoutList"), Checkout.compareCheckouts)
    constructor(name, amount){
        this.name = name
        this.amount = amount
        this.id = Checkout.checkoutCount
        this.updateForm = null
        this.setHTML()
        Checkout.checkoutList.addItem(this)
        Checkout.checkoutCount++
        TipsManager.updateTips()
    }
    static saveState(){
        sessionStorage.setItem("checkoutList", JSON.stringify(Checkout.checkoutList.objectList, (key, value) => {
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
    static compareCheckouts(a, b){
        const getVal = (checkout) => {
            if(checkout.name.toLowerCase() === "bar cash") return Checkout.checkoutCount+1
            if(checkout.name.toLowerCase() === "server cash") return Checkout.checkoutCount+2
            return checkout.id
        }
        return getVal(a) - getVal(b)
    }
    static getCheckouts(){
        return Checkout.checkoutList.objectList
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
        Checkout.checkoutList.removeItem(this)
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
    }
}
export const getCheckouts = Checkout.getCheckouts
export default Checkout