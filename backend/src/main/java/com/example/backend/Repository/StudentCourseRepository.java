package com.example.backend.Repository;

import com.example.backend.Entity.StudentCourse;
import org.springframework.aop.target.LazyInitTargetSource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StudentCourseRepository extends JpaRepository<StudentCourse, Integer> {
    void deleteAllByStudentId(UUID studentId);
    List<StudentCourse> findAllByStudentId(UUID studentId);
}
