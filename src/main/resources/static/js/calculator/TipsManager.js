import {jobList} from "./Job.js";
import {checkoutList} from "./Checkout.js";
import {employeeList} from "./Employee.js";

class TipsManager{
    static updateTips(){
        let totalTips = checkoutList.reduce((totalTips, checkout) => {return totalTips + checkout.amount*100}, 0)
        document.getElementById("totalTips").innerText = "Tip Pool: $" + TipsManager.getHundredthsRep(totalTips/100)
        if(employeeList.length === 0) return
        const totalPointHours = Math.ceil(jobList.reduce((pointHours, job) => {return pointHours + ((job.employeeWorkHours * 100) * (job.points * 100))}, 0))
        const pointHourley = ((totalTips*100)/totalPointHours) 
        let paidTotal = 0
        const tipMap = Array.from(employeeList)
        .map((employee) => {
            const trueTip = Math.floor((.0000001 + (pointHourley * (employee.job.points * 100) * (employee.hours * 100)))*1000000)
            paidTotal += Math.floor(trueTip/10000000000)
            return {
                emp: employee, 
                tip: Math.floor(trueTip/10000000000),
                remainder: trueTip % 10000000000
            }
        })
        .sort((key1, key2) => key2.remainder - key1.remainder)
        totalTips = Math.floor(totalTips/100)
        let ind = 0
        while(paidTotal < totalTips){
            if(ind === tipMap.length) ind === 0
            tipMap[ind++].tip++
            paidTotal++
        }
        tipMap
        .forEach(key => key.emp.setTips(key.tip))
    }
    static getHundredthsRep(amount){
        let ret = Math.floor(amount)
        amount*=100
        amount = Math.floor(amount)
        const hun = amount%10
        amount = Math.floor(amount/10)
        const ten = amount%10
        return ret + "." + ten + hun
    }
}
export const getHundredthsRep = TipsManager.getHundredthsRep
export default TipsManager