package com.example.backend.Controller;

import com.example.backend.DTO.StudentDTO;
import com.example.backend.Services.StudentService.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @SneakyThrows
    @GetMapping
    public String getStudents() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(studentService.getStudents());
    }

    @SneakyThrows
    @GetMapping("/course/{studentId}")
    public String getStudentCourses(@PathVariable String studentId) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(studentService.getStudentCourses(UUID.fromString(studentId)));
    }

    @SneakyThrows
    @GetMapping("/timeTable/{courseId}/{studentId}")
    public String getStudentTimeTable(@PathVariable("courseId") String courseId, @PathVariable("studentId") String studentId) {
        return new ObjectMapper().writeValueAsString(studentService.getStudentTimeTable(UUID.fromString(courseId), UUID.fromString(studentId)));
    }

    @SneakyThrows
    @GetMapping("/filter/{filterText}")
    public String filterStudents(@PathVariable String filterText) {
        return new ObjectMapper().writeValueAsString(studentService.filterStudents(filterText));
    }

    @SneakyThrows
    @GetMapping("/convertExcel")
    public String convertDataToExcel(@RequestParam("courseId") String courseId, @RequestParam("monthId") String monthId, @RequestParam("requestRole") String requestRole) {
        return new ObjectMapper().writeValueAsString(studentService.convertToExcelFile(courseId, monthId, requestRole));
    }

    @SneakyThrows
    @GetMapping("/{id}")
    public String getStudentByGroup(@PathVariable String id) {
        return new ObjectMapper().writeValueAsString(studentService.getStudentsByGroup(UUID.fromString(id)));
    }

    @SneakyThrows
    @GetMapping("/debts/{monthId}")
    public String getStudentByDebt(@PathVariable String monthId) {
        return new ObjectMapper().writeValueAsString(studentService.getStudentsByDebt(Integer.parseInt(monthId)));
    }

    @SneakyThrows
    @GetMapping("/all")
    public String getAllStudent(@RequestParam("courseId") String courseId, @RequestParam("monthId") String monthId) {
        System.out.println(courseId + " " + monthId);
        return new ObjectMapper().writeValueAsString(studentService.getAllStudents(courseId, monthId));
    }

    @SneakyThrows
    @PostMapping
    public String addStudent(@RequestBody StudentDTO studentDTO) {
        studentService.addStudent(studentDTO);
        return new ObjectMapper().writeValueAsString(true);
    }

    @SneakyThrows
    @PutMapping("/{studentId}")
    public String editStudent(@PathVariable String studentId, @RequestBody StudentDTO student, @RequestHeader("isAdmin") String roleName) {
        return new ObjectMapper().writeValueAsString(studentService.editStudent(UUID.fromString(studentId), student, roleName));
    }

    @SneakyThrows
    @PatchMapping("/active/{currentMonthId}")
    public String changeActive(@PathVariable String currentMonthId, @RequestBody Object active) {
        studentService.changeActiveStudent(Integer.parseInt(currentMonthId), (Boolean) active);
        return new ObjectMapper().writeValueAsString(true);
    }

    @SneakyThrows
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable String id, @RequestHeader("isAdmin") String roleName) {
        return new ObjectMapper().writeValueAsString(studentService.deleteStudent(UUID.fromString(id), roleName));
    }
}
