package com.example.backend.Controller;

import com.example.backend.DTO.CourseDTO;
import com.example.backend.Payload.PaymentReq;
import com.example.backend.Services.CourseService.CourseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @SneakyThrows
    @GetMapping
    public String getCourses() {
        return new ObjectMapper().writeValueAsString(courseService.getCourses());
    }

    @SneakyThrows
    @GetMapping("/courses")
    public String getCoursesName(){
        return new ObjectMapper().writeValueAsString(courseService.getCoursesName());
    }

    @SneakyThrows
    @GetMapping("/filter")
    public String getCoursesForFilter(){
        return new ObjectMapper().writeValueAsString(courseService.getCoursesForFilter());
    }

    @SneakyThrows
    @PostMapping
    public String addCourse(@RequestBody CourseDTO courseDTO) {
        courseService.addCourse(courseDTO);
        return new ObjectMapper().writeValueAsString(true);
    }

    @SneakyThrows
    @PatchMapping("/coursePayment/{currentMonthId}")
    public String payForCourse(@PathVariable("currentMonthId") String currentMonthId, @RequestBody PaymentReq paymentReq, @RequestHeader("isAdmin") String roleName){
        return new ObjectMapper().writeValueAsString(courseService.payForCourse(Integer.parseInt(currentMonthId), paymentReq.getPayAmount(), paymentReq.getPayIndex(), UUID.fromString(paymentReq.getAdminId()), roleName));
    }

    @SneakyThrows
    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable("id") String id, @RequestHeader("isAdmin") String roleName){
        return new ObjectMapper().writeValueAsString(courseService.deleteCourse(UUID.fromString(id), roleName));
    }
}
