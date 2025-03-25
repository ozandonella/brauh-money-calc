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

    public List<Employee> findFullShare(){
        return employees.stream()
                .filter(emp -> emp.getPoints()==4.0)
                .toList();
    }

    public Optional<Employee> findById(Integer id){
        return employees.stream()
                .filter(emp -> emp.getId().equals(id))
                .findFirst();
    }
    public void createEmployee(Employee employee){
        employees.add(employee);
    }
    public void updateEmployee(Integer id, Employee employee){
        Optional<Employee> target = findById(id);
        target.ifPresent(value -> employees.set(employees.indexOf(value), employee));
    }
    public void deleteEmployee(Integer id){
        employees.removeIf(emp -> emp.getId().equals(id));
    }
    @PostConstruct
    private void init(){
        employees.add(new Employee("Hana", 11.27, null, null, 4.0,0));
        employees.add(new Employee("Moses", 5.54, null, null, 1.5,1));
        employees.add(new Employee("Mars", 10.13, null, null, 4.0,2));
        employees.add(new Employee("Cami", 4.79, null, null, 1.75,3));
    }

}
