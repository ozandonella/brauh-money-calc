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
    static checkoutExists(name, job, hours){
        Checkout.checkoutList.forEach(checkout => {
            if(checkout.name===name&&checkout.job.equalTo(job)&&checkout.hours===hours)
            return true
        })
        return false
    }
    static checkoutExists(id){
        return !Checkout.checkoutList.every(checkout => checkout.checkoutID!==id)
    }
}