package com.example.backend.Projection;

import com.example.backend.DTO.TimeTableDTO;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Map;

public interface StudentProjection {
    @Value("#{target.first_name}")
    String getFirstName();
    @Value("#{target.last_name}")
    String getLastName();
    @Value("#{target.age}")
    String getAge();
    @Value("#{target.payments}")
    Object getPayments();

}
