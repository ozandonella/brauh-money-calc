import { checkFieldsFilled } from "./CreateController.js"
class Checkout{
    static checkoutCount
    static checkoutForm = document.getElementById("createCheckoutForm")
    static checkoutList = []
    constructor(name, job, hours){
        this.name = name
        this.job = job
        this.hours = hours
        this.checkoutID = "checkout"+Checkout.checkoutCount
        Checkout.checkoutCount++
    }
    static formCreate(){
        const checkoutFormElement = document.getElementById("createCheckoutForm")
        if(!checkFieldsFilled(checkoutFormElement, ["name"])) return
        console.log("checkout created")
    }
}
export default Checkout