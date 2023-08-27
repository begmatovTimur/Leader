package com.example.backend.Projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.UUID;

public interface StudentCourseProjection {
    @Value("#{target.id}")
    Integer getId();
    @Value("#{target.active}")
    Boolean getActive();
    @Value("#{target.payment_amount}")
    Integer getPaymentAmount();
    @Value("#{target.price}")
    Integer getCoursePrice();
    @Value("#{target.first_name}")
    String getFirstName();
    @Value("#{target.month_name}")
    String getMonthName();
    @Value("#{target.payed_at}")
    String getPayedAt();
}
