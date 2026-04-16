package com.smartrail.backend.repository;

import com.smartrail.backend.model.Tren;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrenRepository extends JpaRepository<Tren, String> {

}