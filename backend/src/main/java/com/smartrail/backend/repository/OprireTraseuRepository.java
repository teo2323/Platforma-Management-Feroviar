package com.smartrail.backend.repository;

import com.smartrail.backend.model.OprireTraseu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OprireTraseuRepository extends JpaRepository<OprireTraseu, Integer> {
}