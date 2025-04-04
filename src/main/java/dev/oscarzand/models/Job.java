package dev.oscarzand.models;

public class Job {
    private String name;
    private double points;
    public Job(String name, double points){
        this.name = name;
        this.points = points;
    }
    public String getName(){
        return this.name;
    }
    public double getPoints(){
        return this.points;
    }
    public void setName(String name) {
        this.name = name;
    }

    public void setPoints(double points) {
        this.points = points;
    }
    public String toString(){
        return "job: " + this.name + ", points: " + this.points;
    }
}

