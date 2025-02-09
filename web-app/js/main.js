import CreateController from "./components/CreateController.js";
import TipsManager from "./components/TipsManager.js";
document.addEventListener("DOMContentLoaded", () => {
    new CreateController()
    TipsManager.updateTips()
    console.log(TipsManager.totalTips)
})
