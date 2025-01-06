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
}