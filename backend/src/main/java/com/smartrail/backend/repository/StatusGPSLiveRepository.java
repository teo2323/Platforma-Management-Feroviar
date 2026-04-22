package com.smartrail.backend.repository;

import com.smartrail.backend.model.StatusGPSLive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusGPSLiveRepository extends JpaRepository<StatusGPSLive, Integer> {
    List<StatusGPSLive> findByInstantaCalatorieStare(String stare);
}