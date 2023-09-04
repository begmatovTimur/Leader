package com.example.backend.Repository;

import com.example.backend.Entity.Course;
import com.example.backend.Projection.CourseProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    Course findByName(String courseName);
    @Query(value = """
            select c.id, c.name
                from course c;
            """, nativeQuery = true)
    List<CourseProjection> getCoursesForSelectBox();
}
