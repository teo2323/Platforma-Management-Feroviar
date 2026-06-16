package com.smartrail.backend.repository;

import com.smartrail.backend.model.InstantaCalatorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstantaCalatorieRepository extends JpaRepository<InstantaCalatorie, Integer> {

    List<InstantaCalatorie> findByRutaProgramata_IdRuta(Integer idRuta);

    List<InstantaCalatorie> findByStare(String stare);

    @Query(value = "SELECT tip_incident FROM Alerte_Live WHERE instanta_id = ?1", nativeQuery = true)
    List<String> gasesteAlertePentruInstanta(Integer idInstanta);
}