package com.example.backend.Controller;

import com.example.backend.DTO.UserDTO;
import com.example.backend.Payload.LoginReq;
import com.example.backend.Services.UsersService.UsersService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {
    private final UsersService usersService;

    @SneakyThrows
    @GetMapping
    public String getUsers() {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(usersService.getUsers());
    }

    @SneakyThrows
    @GetMapping("/mentors")
    public String getMentors() {
        return new ObjectMapper().writeValueAsString(usersService.getUserByRoleName());
    }

    @SneakyThrows
    @GetMapping("/checkUser/{userId}")
    public String checkUser(@PathVariable String userId) {
        return new ObjectMapper().writeValueAsString(usersService.checkUser(UUID.fromString(userId)));
    }

    @SneakyThrows
    @PostMapping("/login")
    public String loginUser(@RequestBody LoginReq loginReq) {
        return new ObjectMapper().writeValueAsString(usersService.loginUser(loginReq));
    }

    @SneakyThrows
    @PostMapping("/register")
    public String registerUser(@RequestBody UserDTO userData) {
        return new ObjectMapper().writeValueAsString(usersService.addUser(userData));
    }

    @SneakyThrows
    @PatchMapping("/change-data/{id}")
    public String updateUserData(@RequestBody LoginReq userData, @PathVariable String id, @RequestHeader("isAdmin") String roleName) {
        return new ObjectMapper().writeValueAsString(usersService.updateUserData(userData, UUID.fromString(id), roleName));
    }

    @SneakyThrows
    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable("id") String id, @RequestHeader("isAdmin") String roleName){
        return new ObjectMapper().writeValueAsString(usersService.deleteUser(UUID.fromString(id), roleName));
    }
}
