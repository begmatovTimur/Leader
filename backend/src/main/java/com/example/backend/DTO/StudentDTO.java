package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDTO {
    private String firstName;
    private String lastName;
    private String age;
    private String courseName;
}
