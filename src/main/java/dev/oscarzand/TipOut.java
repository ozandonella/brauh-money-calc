package dev.oscarzand;

import dev.oscarzand.employee.Employee;

import java.util.ArrayList;

public class TipOut {
    private ArrayList<Employee> employees;
    private String date;
    private String primaryPerson;
    private String secondaryPerson;

    public TipOut(ArrayList<Employee> employees, String date, String primaryPerson, String secondaryPerson) {
        this.employees = employees;
        this.date = date;
        this.primaryPerson = primaryPerson;
        this.secondaryPerson = secondaryPerson;
    }
    public ArrayList<Employee> getEmployees() {
        return employees;
    }

    public String getDate() {
        return date;
    }

    public String getPrimaryPerson() {
        return primaryPerson;
    }

    public String getSecondaryPerson() {
        return secondaryPerson;
    }

}
