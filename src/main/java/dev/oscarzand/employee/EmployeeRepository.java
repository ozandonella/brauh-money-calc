package dev.oscarzand.employee;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class EmployeeRepository {
    private final ArrayList<Employee> employees = new ArrayList<>();
    public ArrayList<Employee> findAll(){
        return employees;
    }
    public ArrayList<Employee> findByPoint(Double point){
        return null;
    }

    /*public List<Employee> findFullShare(){

    }
    public Optional<Employee> findById(Integer id){

    }*/
    public void createEmployee(Employee employee){
        employees.add(employee);
    }
    public void updateEmployee(Integer id, Employee employee){

    }
    public void deleteEmployee(Integer id){

    }
    @PostConstruct
    private void init(){

    }

}
