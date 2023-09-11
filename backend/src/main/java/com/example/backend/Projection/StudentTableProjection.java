package com.example.backend.Projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.UUID;

public interface StudentTableProjection {
    @Value("#{target.id}")
    UUID getId();
    @Value("#{target.first_name}")
    String getFirstName();
    @Value("#{target.last_name}")
    String getLastName();
    @Value("#{target.age}")
    String getAge();
    @Value("#{target.register_date}")
    String getRegisterDate();
    @Value("#{target.course_name}")
    String getCourseName();

//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//    private String firstName;
//    private String lastName;
//    private String age;
//    private String registerDate;
}
