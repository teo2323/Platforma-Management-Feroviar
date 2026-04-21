package com.smartrail.backend.repository;

import com.smartrail.backend.model.InstantaCalatorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstantaCalatorieRepository extends JpaRepository<InstantaCalatorie, Integer> {
}