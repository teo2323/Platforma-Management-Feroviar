package com.smartrail.backend.repository;

import com.smartrail.backend.model.RutaProgramata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RutaProgramataRepository extends JpaRepository<RutaProgramata, Integer> {
}