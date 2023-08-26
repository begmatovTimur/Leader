package com.example.backend.Services.RoleService;

import com.example.backend.Entity.Role;
import com.example.backend.Enums.RoleEnum;
import com.example.backend.Repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;

    @Override
    public List<String> getRoles() {
        List<Role> all = roleRepository.findAll();
        List<String> onlyRoleNameList = new ArrayList<>();
        for (Role role : all) {
            if (role.getRoleName().equals("ROLE_MENTOR") || role.getRoleName().equals("ROLE_ADMIN")) {
                onlyRoleNameList.add(role.getRoleName());
            }
        }
        return onlyRoleNameList;
    }
}
