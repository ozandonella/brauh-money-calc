package dev.oscarzand.employee;
import dev.oscarzand.job.Job;
public class Employee {
    private String name;
    private Job job;
    private double hours;
    private double tips;
    public Employee(){}
    public Employee(String name, Job job, double hours, double tips){
        this.name = name;
        this.job = job;
        this.hours = hours;
        this.tips = tips;
    }
    public String getName(){
        return this.name;
    }
    public Job getJob(){
        return this.job;
    }
    public double getHours(){
        return this.hours;
    }
    public double getTips(){
        return this.tips;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public void setHours(double hours) {
        this.hours = hours;
    }

    public void setTips(double tips) {
        this.tips = tips;
    }
    public String toString(){
        return "employee: "+ this.name + ", Job: {"+ this.job + "}, hours: " + this.hours + ", tips: " + this.tips;
    }
}
