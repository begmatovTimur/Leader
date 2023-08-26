package com.example.backend.Repository;

import com.example.backend.Entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    Course findByName(String courseName);
}
