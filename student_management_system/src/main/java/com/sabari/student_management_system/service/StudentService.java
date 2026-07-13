package com.sabari.student_management_system.service;

import com.sabari.student_management_system.model.Student;
import com.sabari.student_management_system.repository.StudentRepository;
import com.sabari.student_management_system.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public List<Student> getAllStudents() {
        log.info("Fetching all students from database");
        return repo.findAll();
    }

    public List<Student> searchStudents(String name, String department) {
        log.info("Searching students: name='{}', department='{}'", name, department);
        boolean hasName = name != null && !name.trim().isEmpty();
        boolean hasDept = department != null && !department.trim().isEmpty();

        if (hasName && hasDept) {
            return repo.findByDepartmentIgnoreCaseAndNameContainingIgnoreCase(department.trim(), name.trim());
        } else if (hasName) {
            return repo.findByNameContainingIgnoreCase(name.trim());
        } else if (hasDept) {
            return repo.findByDepartmentIgnoreCase(department.trim());
        }
        return repo.findAll();
    }

    public Student addStudent(Student student) {
        log.info("Adding new student with USN: {}", student.getUsn());
        if (repo.existsById(student.getUsn())) {
            log.warn("Student with USN {} already exists", student.getUsn());
            throw new IllegalArgumentException("Student with USN " + student.getUsn() + " already exists.");
        }
        return repo.save(student);
    }

    public void delete(Integer id) {
        log.info("Deleting student with USN: {}", id);
        if (!repo.existsById(id)) {
            log.warn("Student with USN {} not found for deletion", id);
            throw new ResourceNotFoundException("Student with USN " + id + " not found.");
        }
        repo.deleteById(id);
    }

    public Student findById(Integer id) {
        log.info("Finding student with USN: {}", id);
        return repo.findById(id)
                .orElseThrow(() -> {
                    log.warn("Student with USN {} not found", id);
                    return new ResourceNotFoundException("Student with USN " + id + " not found.");
                });
    }

    public Student updateById(Student student) {
        log.info("Updating student with USN: {}", student.getUsn());
        if (!repo.existsById(student.getUsn())) {
            log.warn("Student with USN {} not found for update", student.getUsn());
            throw new ResourceNotFoundException("Student with USN " + student.getUsn() + " not found.");
        }
        return repo.save(student);
    }
}
