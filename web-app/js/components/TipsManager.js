import {jobList} from "./Job.js";
import {checkoutList} from "./Checkout.js";
import {employeeList} from "./Employee.js";

class TipsManager{
    static updateTips(){
        
        const totalPointHours = jobList.reduce((pointHours, job) => {return pointHours + (job.employeeWorkHours * job.points)}, 0)
        const pointHourley = checkoutList.reduce((totalTips, checkout) => {return totalTips + checkout.amount}, 0)/totalPointHours
        employeeList.forEach((employee) => employee.setTips(Math.floor(100 * pointHourley * employee.job.points * employee.hours)/100))
    }
}

export default TipsManager