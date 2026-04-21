package com.smartrail.backend.repository;

import com.smartrail.backend.model.Statie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatieRepository extends JpaRepository<Statie, Integer> {
}