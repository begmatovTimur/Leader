package com.example.backend.Services.StudentService;

import com.example.backend.DTO.StudentDTO;
import com.example.backend.Entity.*;
import com.example.backend.Enums.MonthEnum;
import com.example.backend.Projection.CourseProjection;
import com.example.backend.Projection.StudentCourseProjection;
import com.example.backend.Projection.StudentProjection;
import com.example.backend.Projection.StudentTableProjection;
import com.example.backend.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final StudentCourseRepository studentCourseRepository;
    private final MonthRepository monthRepository;
    private final CourseRepository courseRepository;
    private final RoleRepository roleRepository;

    @Override
    public void addStudent(StudentDTO studentData) {
        Student savedStudent = studentRepository.save(generateStudentFromData(studentData));
        Course studentCourse = courseRepository.findByName(studentData.getCourseName());
        addStudentCourse(savedStudent, studentCourse);
    }

    @Override
    @Transactional
    public String editStudent(UUID studentId, StudentDTO student, String roleName) {
        System.out.println(student);
        Role userRole = roleRepository.findByRoleName(roleName);
        if (userRole.getRoleName().equals("ROLE_OWNER")) {
            Student newStudent = generateStudentFromData(student);
            newStudent.setId(studentId);
            List<StudentCourse> allByStudentId = studentCourseRepository.findAllByStudentId(studentId);
            Course course = courseRepository.findByName(student.getCourseName());
            for (StudentCourse studentCourse : allByStudentId) {
                studentCourse.setCourse(course);
                studentCourse.setStudent(newStudent);
            }
            studentCourseRepository.saveAll(allByStudentId);
            studentRepository.save(newStudent);
            return "success";
        } else {
            return "error";
        }
    }

    @Override
    public void addStudentCourse(Student savedStudent, Course studentCourse) {
        LocalDate currentDate = LocalDate.now();
        List<Month> months = monthRepository.findAll();
        int reqMonth = 0;
        int currentMonth = currentDate.getMonthValue();
        for (int i = currentMonth - 1; i < months.size() + 1; i++) {
            if (i == 12) {
                i = 0;
            }
            String monthName = MonthEnum.values()[i].name();
            Month monthEntity = monthRepository.findByName(monthName);
            reqMonth++;
            generateStudentCourse(savedStudent, studentCourse, monthEntity);
            if (reqMonth == 12) {
                break;
            }
        }
    }

    @Override
    public List<StudentTableProjection> getStudents() {
        return studentRepository.getStudentsForTable();
    }

    @Override
    public List<Student> getStudentsByGroup(UUID id) {
        return studentRepository.getStudentsByGroup(id);
    }

    @Override
    public List<Student> getStudentsByDebt(Integer monthId) {
        return studentRepository.getStudentByDebt(monthId);
    }

    @Override
    public List<Student> getAllStudents(String courseId, String monthId) {
        if (!monthId.isEmpty() && !courseId.isEmpty() && !courseId.equals("undefined") && !monthId.equals("0") && !monthId.equals("undefined")) {
            List<Student> studentProjections = studentRepository.getStudentsByAll(Integer.valueOf(monthId), UUID.fromString(courseId));
            System.out.println(studentProjections);
            return studentProjections;
        } else if (courseId.isEmpty() && !monthId.equals("undefined") && !monthId.isEmpty()) {
            System.out.println(monthId + " monthId");
            List<Student> studentProjections = studentRepository.getStudentByDebt(Integer.valueOf(monthId));
            System.out.println(studentProjections);
            return studentProjections;
        } else if (monthId.equals("0") && !courseId.isEmpty() && !courseId.equals("undefined")) {
            return studentRepository.getStudentsByGroup(UUID.fromString(courseId));
        }
        return studentRepository.findAll();
    }

    @Override
    public List<CourseProjection> getStudentCourses(UUID studentId) {
        return studentRepository.getStudentCourses(studentId);
    }

    @Override
    public List<StudentCourseProjection> getStudentTimeTable(UUID courseId, UUID studentId) {
        return studentRepository.getStudentCourse(courseId, studentId);
    }

    @Override
    public void changeActiveStudent(Integer currentMonthId, Boolean active) {
        StudentCourse studentCourse = studentCourseRepository.findById(currentMonthId).orElseThrow();
        studentCourse.setActive(active);
        studentCourseRepository.save(studentCourse);
    }

    @Override
    public List<Student> filterStudents(String filterText) {
        return studentRepository.filterByFirstNameOrLastNameBySimilarity(filterText);
    }

    @SneakyThrows
    @Override
    public List<StudentProjection> convertToExcelFile(String courseId, String monthId, String requestRole) {
        System.out.println(requestRole);
        if (!monthId.isEmpty() && !courseId.isEmpty() && !courseId.equals("undefined") && !monthId.equals("0") && !monthId.equals("undefined")) {
            List<StudentProjection> studentProjections = studentRepository.convertToExcelFileByAll(Integer.valueOf(monthId), UUID.fromString(courseId));
            System.out.println(studentProjections);
            return studentProjections;
        } else if (courseId.isEmpty() && !monthId.equals("undefined") && !monthId.isEmpty()) {
            System.out.println(monthId + " monthId");
            List<StudentProjection> studentProjections = studentRepository.convertToExcelFileByMonth(Integer.valueOf(monthId));
            System.out.println(studentProjections);
            return studentProjections;
        } else if (monthId.equals("0") && !courseId.isEmpty() && !courseId.equals("undefined")) {
            return studentRepository.convertToExcelFileByCourse(UUID.fromString(courseId));
        }
        if (requestRole.equals("ROLE_OWNER")) {
            return studentRepository.convertToExcelFileByNothing();
        }
        return null;
    }


    @Override
    @Transactional
    public String deleteStudent(UUID id, String roleName) {
        System.out.println(roleName);
        Role userRole = roleRepository.findByRoleName(roleName);
        if (userRole.getRoleName().equals("ROLE_OWNER")) {
            studentCourseRepository.deleteAllByStudentId(id);
            studentRepository.deleteById(id);
            return "success";
        } else {
            return "error";
        }
    }

    private static Student generateStudentFromData(StudentDTO studentData) {
        LocalDate now = LocalDate.now();
        return new Student(
                null,
                studentData.getFirstName(),
                studentData.getLastName(),
                studentData.getAge(),
                now.getDayOfMonth() + " - " + now.getMonth().name() + ", " + now.getYear() + " - yil"
        );
    }

    private void generateStudentCourse(Student savedStudent, Course studentCourse, Month monthEntity) {
        studentCourseRepository.save(
                new StudentCourse(
                        null,
                        savedStudent,
                        studentCourse,
                        monthEntity,
                        null,
                        false,
                        0,
                        null,
                        Timestamp.from(Instant.now()),
                        Timestamp.from(Instant.now()),
                        null
                )
        );
    }
}
