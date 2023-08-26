package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(unique = true, nullable = false)
    private UUID id;
    @Column(unique = true, nullable = false)
    private String roleName;
    @CreationTimestamp
    private Timestamp created_at;
    @UpdateTimestamp
    private Timestamp updated_at;
}