package com.example.backend.Services.CourseService;

import com.example.backend.DTO.CourseDTO;
import com.example.backend.DTO.UserDTO;
import com.example.backend.Entity.Course;
import com.example.backend.Entity.Role;
import com.example.backend.Entity.StudentCourse;
import com.example.backend.Entity.User;
import com.example.backend.Projection.CourseProjection;
import com.example.backend.Repository.CourseRepository;
import com.example.backend.Repository.StudentCourseRepository;
import com.example.backend.Repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final StudentCourseRepository studentCourseRepository;
    private final UsersRepository usersRepository;

    @Override
    public void addCourse(CourseDTO courseData) {
        courseRepository.save(generateCourseFromData(courseData));
    }

    @Override
    public String payForCourse(Integer currentMonthId, String payAmount, UUID adminId, String roleName) {
        StudentCourse studentCourse = studentCourseRepository.findById(currentMonthId).orElseThrow();
        User admin = usersRepository.findById(adminId).orElseThrow();
        Integer payedTime = checkPayTime(studentCourse);
        Integer now = LocalDateTime.now().getMinute();
        int i = Integer.parseInt(payAmount);
        if (roleName.equals("ROLE_MENTOR")){
            return "error";
        } else if (roleName.equals("ROLE_OWNER") || now - payedTime <= 2 || studentCourse.getPayedAt() == null) {
            studentCourse.setPaymentAmount(i);
            studentCourse.setPayedAt(Timestamp.from(Instant.now()));
            studentCourse.setUser(admin);
            studentCourseRepository.save(studentCourse);
            return "success";
        }
        return "error";
    }

    @Override
    public String deleteCourse(UUID id, String roleName) {
        if (roleName.equals("ROLE_OWNER")){
            courseRepository.deleteById(id);
           return "success";
        } else {
            return "error";
        }
    }

    private static int checkPayTime(StudentCourse studentCourse) {
        Timestamp payedAt = studentCourse.getPayedAt();
        if (payedAt != null) {
            return studentCourse.getPayedAt().toLocalDateTime().getMinute();
        } else {
            return Timestamp.from(Instant.now()).toLocalDateTime().getMinute();
        }
    }

    @Override
    public List<CourseDTO> getCourses() {
        List<Course> all = courseRepository.findAll();
        List<CourseDTO> courses = new ArrayList<>();
        for (Course course : all) {
            CourseDTO courseDTO = new CourseDTO(course.getId(),course.getName(), course.getPrice(), course.getUser().getUsername());
            courses.add(courseDTO);
        }
        return courses;
    }

    @Override
    public List<CourseProjection> getCoursesForFilter() {
        return courseRepository.getCoursesForSelectBox();
    }

    @Override
    public List<String> getCoursesName() {
        List<Course> all = courseRepository.findAll();
        List<String> onlyCourseNameList = new ArrayList<>();
        for (Course course : all) {
            onlyCourseNameList.add(course.getName());
        }
        return onlyCourseNameList;
    }

    private Course generateCourseFromData(CourseDTO courseData) {
        return new Course(
                null,
                courseData.getName(),
                courseData.getPrice(),
                usersRepository.findByUsername(courseData.getTeacherName())
        );
    }
}
