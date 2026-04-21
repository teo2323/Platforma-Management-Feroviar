package com.smartrail.backend.repository;

import com.smartrail.backend.model.VagonTren;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VagonTrenRepository extends JpaRepository<VagonTren, Integer> {
}