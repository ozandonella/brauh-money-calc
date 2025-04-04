package dev.oscarzand.checkout;

public class Checkout {
    private String name;
    private double amount;
    public Checkout(){}
    public Checkout(String name, double amount){
        this.name = name;
        this.amount = amount;
    }
    public String getName(){
        return this.name;
    }
    public double getAmount(){
        return this.amount;
    }
    public void setName(String name){
        this.name = name;
    }
    public void setAmount(double amount){
        this.amount = amount;
    }
    public String toString(){
        return "checkout: "+ this.name + ", amount: " + this.amount;
    }
}
