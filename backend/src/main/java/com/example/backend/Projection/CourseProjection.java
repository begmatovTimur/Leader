package com.example.backend.Projection;


import org.springframework.beans.factory.annotation.Value;

import java.util.UUID;

public interface CourseProjection {
    @Value("#{target.id}")
    UUID getId();
    @Value("#{target.name}")
    String getName();
}
