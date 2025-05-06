package dev.oscarzand.models;

public class Job {
    private String name;
    private double points;
    private double rate;
    public Job(String name, double points, double rate){
        this.name = name;
        this.points = points;
        this.rate = rate;
    }
    public String getName(){
        return this.name;
    }
    public double getPoints(){
        return this.points;
    }
    public double getRate() {
        return this.rate;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setPoints(double points) {
        this.points = points;
    }
    public void setRate(double rate) {
        this.rate = rate;
    }
    public String toString(){
        return "job: " + this.name + ", points: " + this.points + ", rate: " + this.rate;
    }
}

