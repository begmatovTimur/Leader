package com.example.backend.Services.UsersService;

import com.example.backend.DTO.UserDTO;
import com.example.backend.Entity.Role;
import com.example.backend.Entity.User;
import com.example.backend.Payload.LoginReq;
import com.example.backend.Repository.RoleRepository;
import com.example.backend.Repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {
    private final UsersRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public List<UserDTO> getUsers() {
        List<User> all = userRepository.findAll();
        List<UserDTO> users = new ArrayList<>();
        for (User user : all) {
            UserDTO userDTO = new UserDTO(user.getId(), user.getUsername(), user.getPhone(), user.getPassword(), user.getRole().getRoleName());
            users.add(userDTO);
        }
        return users;
    }

    @Override
    public HttpEntity<?> addUser(UserDTO userData) {
        User newUser = generateUserFromDTO(userData);
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    private User generateUserFromDTO(UserDTO userData) {
        return new User(
                userData.getId(),
                userData.getUsername(),
                userData.getPhone(),
                userData.getPassword(),
                addUserRoleIfAbsent(userData.getRoleName())
        );
    }

    @Override
    public List<String> getUserByRoleName() {
        List<User> all = userRepository.findAll();
        List<String> users = new ArrayList<>();
        for (User user : all) {
            if (user.getRole().getRoleName().equals("ROLE_MENTOR")) {
                users.add(user.getUsername());
            }
        }
        return users;
    }

    @Override
    public String deleteUser(UUID id, String roleName) {
        String roleOwner = "ROLE_OWNER";
        if (roleName.equals(roleOwner)) {
            String userRole = userRepository.findById(id).orElseThrow().getRole().getRoleName();
            if (!userRole.equals(roleOwner)) {
                userRepository.deleteById(id);
                return "success";
            } else {
                return "owner-delete-error";
            }
        } else {
            return "error";
        }
    }

    @Override
    public String loginUser(LoginReq loginReq) {
        User loginedUser = userRepository.findByUsername(loginReq.getUsername());
        if (loginedUser != null && loginedUser.getUsername().equals(loginedUser.getUsername()) && loginedUser.getPassword().equals(loginReq.getPassword())) {
            System.out.println("hello");
            return loginedUser.getId().toString();
        }
        return "topilmadi";
    }

    @Override
    public String checkUser(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return user.getRole().getRoleName();
    }

    @Override
    public String updateUserData(LoginReq userData, UUID id, String roleName) {
        if (roleName.equals("ROLE_OWNER")){
            User user = userRepository.findById(id).orElseThrow();
            user.setUsername(userData.getUsername());
            user.setPassword(userData.getPassword());
            userRepository.save(user);
            return "success";
        } else {
            return "error";
        }
    }

    private Role addUserRoleIfAbsent(String roleName) {
        Role userRole = roleRepository.findByRoleName(roleName);
        if (userRole == null) {
            return roleRepository.save(new Role(
                    null,
                    roleName,
                    Timestamp.from(Instant.now()),
                    null
            ));
        }

        return roleRepository.findByRoleName(roleName);
    }
}
