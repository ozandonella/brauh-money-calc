import { checkFieldsFilled } from "./CreateController.js"
class Employee{
    static employeeCount
    static employeeForm = document.getElementById("createEmployeeForm")
    static employeeList = []
    constructor(name, job, hours){
        this.name = name
        this.job = job
        this.hours = hours
        this.employeeID = "employee"+Employee.employeeCount
        Employee.employeeCount++
    }
    static employeeExists(name, job, hours){
        Employee.employeeList.forEach(employee => {
            if(employee.name===name&&employee.job.equalTo(job)&&employee.hours===hours)
            return true
        })
        return false
    }
    static employeeExists(id){
        return !Employee.employeeList.every(employee => employee.employeeID!==id)
    }

    static formCreate(){
        const employeeFormElement = document.getElementById("createEmployeeForm")
        if(!validateEmployee(employeeFormElement)) return
        const formData = new FormData(employeeFormElement)
        const employee = new Employee(formData.get("name"), formData.get("job"), formData.get("hours"))
        console.log(employee)
        const employeeDivElement = document.getElementById("employeeDiv")
        console.log("employee created")
    }
    
    validateEmployee(employeeformElement){
        if(!checkFieldsFilled(employeeformElement, ["name"])){
            console.log("employee must have name")
            return false
        }
        const isServer=jobMap.get(new FormData(employeeformElement).get("job")).isServer
        if(isServer&&!checkFieldsFilled(employeeformElement, ["checkout"])){
            console.log("server employee must have a checkout")
            return false
        }
        return true
    }

}
export default Employee