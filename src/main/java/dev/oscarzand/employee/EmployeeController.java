package dev.oscarzand.employee;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeRepository employeeRepository;
    public EmployeeController(EmployeeRepository employeeRepository){
        this.employeeRepository = employeeRepository;
    }

    /*
    REQUESTS
     */
    @RequestMapping()
    List<Employee> findAll() {
        return employeeRepository.findAll();
    }
    @RequestMapping("/fullshare")
    List<Employee> findFullShare() {
        List<Employee> employees = employeeRepository.findFullShare();
        if (!employees.isEmpty()) return employees;
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No employees are full share");
    }
    @RequestMapping("/{id}")
    Employee findById(@PathVariable Integer id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if(employee.isPresent()) return employee.get();
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found");
    }
    /*
    POSTS
     */
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    void create(@RequestBody Employee employee){
        employeeRepository.createEmployee(employee);
    }
    /*
    PUTS
     */
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void updateEmployee(@RequestBody Employee employee, @PathVariable Integer id){
        employeeRepository.updateEmployee(id, employee);
    }
    /*
    DELETES
     */
    @DeleteMapping("/{id}")
    void deleteEmployee(@PathVariable Integer id){
        employeeRepository.deleteEmployee(id);
    }
}
