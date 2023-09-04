package com.example.backend.Services.StudentService;

import com.example.backend.DTO.StudentDTO;
import com.example.backend.Entity.Course;
import com.example.backend.Entity.Student;
import com.example.backend.Projection.CourseProjection;
import com.example.backend.Projection.StudentCourseProjection;
import com.example.backend.Projection.StudentProjection;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface StudentService {
    void addStudent(StudentDTO studentData);
    void addStudentCourse(Student savedStudent, Course studentCourse);
    void changeActiveStudent(Integer currentMonthId, Boolean active);
    String editStudent(UUID studentId, StudentDTO student, String roleName);
    String deleteStudent(UUID id, String roleName);
    List<StudentCourseProjection> getStudentTimeTable(UUID courseId, UUID studentId);
    List<CourseProjection> getStudentCourses(UUID studentId);
    List<StudentProjection> convertToExcelFile();
    List<Student> filterStudents(String filterText);
    List<Student> getStudents();
    List<Student> getStudentsByGroup(UUID id);
}
