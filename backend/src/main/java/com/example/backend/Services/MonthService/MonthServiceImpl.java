package com.example.backend.Services.MonthService;

import com.example.backend.Entity.Month;
import com.example.backend.Repository.MonthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MonthServiceImpl implements MonthService {
    private final MonthRepository monthRepository;

    @Override
    public List<Month> getMonths() {
        return monthRepository.findAll();
    }
}
