package com.example.backend.Controller;

import com.example.backend.Services.RoleService.RoleService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.GeneratedValue;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @SneakyThrows
    @GetMapping
    public String getRoles() {
        return new ObjectMapper().writeValueAsString(roleService.getRoles());
    }
}
