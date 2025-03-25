package dev.oscarzand.employee;

public class Employee {
    private Integer id;
    private String name;
    private Double hours;
    private Double startTime;
    private Double endTime;
    private Double points;
    private Integer pay;
    public Employee() {

    }

    public Employee(String name, Double hours, Double startTime, Double endTime, Double points, Integer id) {
        this.id=id;
        this.name = name;
        this.hours = hours;
        this.startTime = startTime;
        this.endTime = endTime;
        this.points=points;
    }

    public Integer getId(){return id;}

    public void setId(Integer id){this.id=id;}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getHours() {
        return hours;
    }

    public void setHours(Double hours) {
        this.hours = hours;
    }

    public Double getStartTime() {
        return startTime;
    }

    public void setStartTime(Double startTime) {
        this.startTime = startTime;
    }

    public Double getEndTime() {
        return endTime;
    }

    public void setEndTime(Double endTime) {
        this.endTime = endTime;
    }
    public Double getPoints() {
        return points;
    }

    public void setPoints(Double points) {
        this.points = points;
    }
    public Integer getPay() {
        return pay;
    }

    public void setPay(Integer pay) {
        this.pay = pay;
    }

    @Override
    public String toString() {
        return "\nname: "+name+"\nhours: "+hours+"\npoints: "+points;
    }
}
