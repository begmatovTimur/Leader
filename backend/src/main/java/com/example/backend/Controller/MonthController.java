package com.example.backend.Controller;

import com.example.backend.Services.MonthService.MonthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/month")
@RequiredArgsConstructor
public class MonthController {
    private final MonthService monthService;

    @SneakyThrows
    @GetMapping
    public String getMonths() {
        return new ObjectMapper().writeValueAsString(monthService.getMonths());
    }
}
