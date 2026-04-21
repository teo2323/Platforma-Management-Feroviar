package com.smartrail.backend.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "Rute_Programate")
public class RutaProgramata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruta")
    private Integer idRuta;

    @ManyToOne
    @JoinColumn(name = "tren_id")
    private Tren tren;

    @ManyToOne
    @JoinColumn(name = "statie_plecare_id")
    private Statie statiePlecare;

    @ManyToOne
    @JoinColumn(name = "statie_destinatie_id")
    private Statie statieDestinatie;

    @Column(name = "ora_plecare_programata")
    private LocalTime oraPlecareProgramata;

    @Column(name = "ora_sosire_programata")
    private LocalTime oraSosireProgramata;

    public RutaProgramata() {}


    public Integer getIdRuta() { return idRuta; }
    public void setIdRuta(Integer idRuta) { this.idRuta = idRuta; }

    public Tren getTren() { return tren; }
    public void setTren(Tren tren) { this.tren = tren; }

    public Statie getStatiePlecare() { return statiePlecare; }
    public void setStatiePlecare(Statie statiePlecare) { this.statiePlecare = statiePlecare; }

    public Statie getStatieDestinatie() { return statieDestinatie; }
    public void setStatieDestinatie(Statie statieDestinatie) { this.statieDestinatie = statieDestinatie; }

    public LocalTime getOraPlecareProgramata() { return oraPlecareProgramata; }
    public void setOraPlecareProgramata(LocalTime oraPlecareProgramata) { this.oraPlecareProgramata = oraPlecareProgramata; }

    public LocalTime getOraSosireProgramata() { return oraSosireProgramata; }
    public void setOraSosireProgramata(LocalTime oraSosireProgramata) { this.oraSosireProgramata = oraSosireProgramata; }
}