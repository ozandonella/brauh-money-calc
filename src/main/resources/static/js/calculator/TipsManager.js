import {jobList} from "./Job.js";
import {checkoutList} from "./Checkout.js";
import {employeeList} from "./Employee.js";

class TipsManager{
    static updateTips(){
        let totalTips = checkoutList.reduce((totalTips, checkout) => {
            //console.log("old: "+totalTips + checkout.amount*100)
            //console.log("new: "+totalTips + TipsManager.moveDecimal(checkout.amount,2))
            return totalTips + TipsManager.moveDecimal(checkout.amount,2)
        }, 0)
        document.getElementById("totalTips").innerText = "Tip Pool: $" + TipsManager.getHundredthsRep(totalTips/100)
        sessionStorage.setItem("totalTips", TipsManager.moveDecimal(Math.floor(totalTips),-2))
        //console.log("curr: "+TipsManager.moveDecimal(Math.floor(totalTips),-2))
        //console.log("old: "+totalTips/100)
        //console.log("new: "+TipsManager.moveDecimal(totalTips,-2))
        if(employeeList.length === 0){
            document.getElementById("hourlyPerPoint").innerText = "Rate(1.00) >= $0.00"
            sessionStorage.setItem("singlePointHourly", "0.00")
            return
        }
        const totalPointHours = Math.ceil(jobList.reduce((pointHours, job) => {
            //console.log("old: "+pointHours + ((job.employeeWorkHours * 100) * (job.points * 100)))
            //console.log("new: "+pointHours + TipsManager.moveDecimal(job.employeeWorkHours,2) * TipsManager.moveDecimal(job.points,2))
            return pointHours + TipsManager.moveDecimal(job.employeeWorkHours,2) * TipsManager.moveDecimal(job.points,2)
            }, 0))
        const pointHourly = TipsManager.moveDecimal(totalTips,2)/totalPointHours
        //console.log("old: " +((totalTips*100)/totalPointHours))
        //console.log("new: " + TipsManager.moveDecimal(totalTips,2)/totalPointHours)
        document.getElementById("hourlyPerPoint").innerText = "Rate(1.00) >= $" + TipsManager.getHundredthsRep(pointHourly)
        sessionStorage.setItem("singlePointHourly", TipsManager.getHundredthsRep(pointHourly))
        let paidTotal = 0
        const tipMap = Array.from(employeeList)
        .map((employee) => {
            const trueTip = Math.floor(TipsManager.moveDecimal(.0000001 + pointHourly*TipsManager.moveDecimal(employee.job.points,2) * TipsManager.moveDecimal(employee.hours,2),6))
            const curr = Math.floor(TipsManager.moveDecimal(trueTip,-10))
            paidTotal += curr
            //console.log("old: "+ Math.floor(trueTip/10000000000))
            //console.log("new: "+ Math.floor(TipsManager.moveDecimal(trueTip,-10)))

            return {
                emp: employee, 
                tip: curr,
                remainder: trueTip % 10000000000
            }
        })
        .sort((key1, key2) => key2.remainder - key1.remainder)
        totalTips = Math.floor(TipsManager.moveDecimal(totalTips,-2))
        //console.log("old: " + Math.floor(totalTips/100))
        //console.log("new: "+ Math.floor(TipsManager.moveDecimal(totalTips,-2)))
        let ind = 0
        while(paidTotal < totalTips){
            if(ind === tipMap.length) ind = 0
            tipMap[ind++].tip++
            paidTotal++
        }
        tipMap
        .forEach(key => key.emp.setTips(key.tip))
    }
    static getHundredthsRep(amount){
        let ret = Math.floor(amount)
        amount = Math.floor(TipsManager.moveDecimal(amount,2))
        const hun = amount%10
        amount = Math.floor(TipsManager.moveDecimal(amount, -1))
        const ten = amount%10
        return ret + "." + ten + hun
    }
    static moveDecimal(value, steps){
        if(steps === 0) return value
        value = value.toString()
        let currDecimalInd = 0
        while(currDecimalInd<value.length && value.charCodeAt(currDecimalInd) !== 46) currDecimalInd++
        if(currDecimalInd === value.length) value += "."
        let targetDecimalInd = currDecimalInd + steps
        let len = Math.max(value.length, targetDecimalInd+1)
        //console.log(value)
        //console.log("steps: "+ steps)
        //console.log("target: " + targetDecimalInd)
        //console.log("length: " + len)
        let str = targetDecimalInd < 0 ? "0" : ""
        for(let ind = Math.min(targetDecimalInd, 0); ind < len; ind++){
            if(value.charCodeAt(ind) === 46) continue
            let next = ind >= 0 && ind < value.length ? value.charAt(ind) : "0"
            if(ind === targetDecimalInd){
                if(steps < 0) next = "." + next
                else if (ind < len-1) next += "."
            }
            str += next
           // console.log("ind: "+ ind + ", next: "+next)
            //console.log(str)
        }
        //console.log(Number(str))
        return Number(str)
    }
    static testMoveDecimal(){
        const testOne = [0.00001, 0.0001 ,0.001 ,0.01 ,0.1 ,1 ,10, 100, 1000, 10000]
        const testTwo = [0.05432112345, 0.5432112345, 5.432112345, 54.32112345, 543.2112345, 5432.112345, 54321.12345, 543211.2345, 5432112.345, 54321123.45, 543211234.5, 5432112345, 54321123450]
        for(let i= -5; i < 5; i++){
            console.log(testOne[i+5] + " == " + TipsManager.moveDecimal(1,i) + " -> " + String(testOne[i+5] === TipsManager.moveDecimal(1,i)))
        }
        for(let i= -6; i <= 6; i++){
            console.log(testTwo[i+6] + "==" + TipsManager.moveDecimal(54321.12345,i) + " -> " + String(testTwo[i+6] === TipsManager.moveDecimal(54321.12345,i)))
        }
    }
}
export default TipsManager