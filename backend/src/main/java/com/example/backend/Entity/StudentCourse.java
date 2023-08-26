package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    private Student student;
    @ManyToOne
    private Course course;
    @ManyToOne
    private Month month;
    @ManyToOne
    private User user;
    private Boolean active;
    private Integer paymentAmount;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Timestamp payedAt;
}
