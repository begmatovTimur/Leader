package com.example.backend.Services.CourseService;

import com.example.backend.DTO.CourseDTO;
import com.example.backend.Entity.Course;

import java.util.List;
import java.util.UUID;

public interface CourseService {
    void addCourse(CourseDTO courseData);
    String payForCourse(Integer currentMonthId, String payAmount, UUID adminId, String roleName);
    String deleteCourse(UUID id, String roleName);
    List<String> getCoursesName();
    List<CourseDTO> getCourses();
}
