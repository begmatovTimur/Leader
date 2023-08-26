package com.example.backend.Repository;

import com.example.backend.Entity.Role;
import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface UsersRepository extends JpaRepository<User, UUID> {
    User findByUsername(String ownerUserName);

    User findByPassword(String username);

    List<User> findAllByRole(Role role);

    User findByPhone(String phone);
}
