package com.sabari.student_management_system.controller;

import com.sabari.student_management_system.model.Student;
import com.sabari.student_management_system.service.StudentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
@Slf4j
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Student>> showAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String department) {
        log.info("Received request to fetch all/search students: name='{}', department='{}'", name, department);
        List<Student> students = service.searchStudents(name, department);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> showStudentById(@PathVariable Integer id) {
        log.info("Received request to fetch student with ID: {}", id);
        Student student = service.findById(id);
        return ResponseEntity.ok(student);
    }

    @PostMapping
    public ResponseEntity<Student> addStudent(@Valid @RequestBody Student student) {
        log.info("Received request to add student: {}", student);
        Student savedStudent = service.addStudent(student);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Integer id) {
        log.info("Received request to delete student with ID: {}", id);
        service.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Student with USN " + id + " has been deleted successfully.");
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<Student> updateStudent(@Valid @RequestBody Student student) {
        log.info("Received request to update student: {}", student);
        Student updatedStudent = service.updateById(student);
        return ResponseEntity.ok(updatedStudent);
    }
}
