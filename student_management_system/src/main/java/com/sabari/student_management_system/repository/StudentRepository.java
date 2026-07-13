package com.sabari.student_management_system.repository;

import com.sabari.student_management_system.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student,Integer> {
    List<Student> findByNameContainingIgnoreCase(String name);
    List<Student> findByDepartmentIgnoreCase(String department);
    List<Student> findByDepartmentIgnoreCaseAndNameContainingIgnoreCase(String department, String name);
}
