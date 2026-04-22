package com.smartrail.backend.repository;

import com.smartrail.backend.model.RutaProgramata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RutaProgramataRepository extends JpaRepository<RutaProgramata, Integer> {
    @Query("SELECT r FROM RutaProgramata r " +
            "JOIN OprireTraseu oPlecare ON oPlecare.rutaProgramata = r " +
            "JOIN OprireTraseu oDestinatie ON oDestinatie.rutaProgramata = r " +
            "WHERE oPlecare.statie.numeStatie = :plecare " +
            "AND oDestinatie.statie.numeStatie = :destinatie " +
            "AND oPlecare.ordineStatie < oDestinatie.ordineStatie")
    List<RutaProgramata> gasesteRuteValide(
            @Param("plecare") String plecare,
            @Param("destinatie") String destinatie);
}