import CreateController from "./CreateController.js";
document.addEventListener("DOMContentLoaded", () => {
    if(sessionStorage.getItem("HTML")){
        document.documentElement.innerHTML = sessionStorage.getItem("HTML")
    }
    else new CreateController()
})
