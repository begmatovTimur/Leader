package com.example.backend.Services.UsersService;

import com.example.backend.DTO.UserDTO;
import com.example.backend.Payload.LoginReq;
import org.springframework.http.HttpEntity;

import java.util.List;
import java.util.UUID;

public interface UsersService {
    String deleteUser(UUID uuid, String roleName);
    String loginUser(LoginReq loginReq);
    String checkUser(UUID userId);
    String updateUserData(LoginReq userData, UUID id, String roleName);
    List<UserDTO> getUsers();
    List<String> getUserByRoleName();
    HttpEntity<?> addUser(UserDTO dto);
}
