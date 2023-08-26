package com.example.backend.Repository;

import com.example.backend.Entity.Month;
import com.example.backend.Enums.MonthEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MonthRepository extends JpaRepository<Month, Integer> {
    Month findByName(String name);
}
