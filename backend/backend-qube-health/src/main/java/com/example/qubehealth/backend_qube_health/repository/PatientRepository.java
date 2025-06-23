package com.example.qubehealth.backend_qube_health.repository;

import com.example.qubehealth.backend_qube_health.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
