package dev.oscarzand.tipout;

import java.util.Date;
import java.util.List;
import dev.oscarzand.employee.Employee;
import dev.oscarzand.job.Job;
import dev.oscarzand.checkout.Checkout;
public class Tipout {
    private String primaryPerson;
    private String secondaryPerson;
    private String date;
    private double totalTips;
    private List<Job> jobList;
    private List<Employee> employeeList;
    private List<Checkout> checkoutList;
    public Tipout(){}
    public Tipout(String primaryPerson, String secondaryPerson, String date, double totalTips, List<Job> jobList, List<Employee> employeeList, List<Checkout> checkoutList){
        this.primaryPerson = primaryPerson;
        this.secondaryPerson = secondaryPerson;
        this.date = date;
        this.totalTips = totalTips;
        this.jobList = jobList;
        this.employeeList = employeeList;
        this.checkoutList = checkoutList;
    }
    public String getPrimaryPerson(){
        return this.primaryPerson;
    }
    public String getSecondaryPerson(){
        return this.secondaryPerson;
    }
    public String getDate(){
        return this.date;
    }
    public double getTotalTips(){
        return this.totalTips;
    }
    public List<Job> getJobList(){
        return this.jobList;
    }
    public List<Employee> getEmployeeList(){
        return this.employeeList;
    }
    public List<Checkout> getCheckoutList(){
        return this.checkoutList;
    }
    public void setPrimaryPerson(String primaryPerson) {
        this.primaryPerson = primaryPerson;
    }

    public void setSecondaryPerson(String secondaryPerson) {
        this.secondaryPerson = secondaryPerson;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setTotalTips(double totalTips) {
        this.totalTips = totalTips;
    }

    public void setJobList(List<Job> jobList) {
        this.jobList = jobList;
    }

    public void setEmployeeList(List<Employee> employeeList) {
        this.employeeList = employeeList;
    }

    public void setCheckoutList(List<Checkout> checkoutList) {
        this.checkoutList = checkoutList;
    }
    public void print(){
        System.out.println(this.primaryPerson);
        System.out.println(this.secondaryPerson);
        System.out.println(this.totalTips);
        System.out.println(this.date);
        System.out.println(this.employeeList);
        System.out.println(this.jobList);
        System.out.println(this.checkoutList);
    }
}
