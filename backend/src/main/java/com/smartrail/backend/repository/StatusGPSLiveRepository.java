package com.smartrail.backend.repository;

import com.smartrail.backend.model.StatusGPSLive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusGPSLiveRepository extends JpaRepository<StatusGPSLive, Integer> {
}