package com.smartrail.backend.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "Opriri_Traseu")
public class OprireTraseu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ruta_id")
    private RutaProgramata rutaProgramata;


    @ManyToOne
    @JoinColumn(name = "statie_id")
    private Statie statie;

    @Column(name = "ora_sosire")
    private LocalTime oraSosire;

    @Column(name = "ora_plecare")
    private LocalTime oraPlecare;

    @Column(name = "ordine_statie")
    private Integer ordineStatie;

    public OprireTraseu() {}


    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public RutaProgramata getRutaProgramata() { return rutaProgramata; }
    public void setRutaProgramata(RutaProgramata rutaProgramata) { this.rutaProgramata = rutaProgramata; }

    public Statie getStatie() { return statie; }
    public void setStatie(Statie statie) { this.statie = statie; }

    public LocalTime getOraSosire() { return oraSosire; }
    public void setOraSosire(LocalTime oraSosire) { this.oraSosire = oraSosire; }

    public LocalTime getOraPlecare() { return oraPlecare; }
    public void setOraPlecare(LocalTime oraPlecare) { this.oraPlecare = oraPlecare; }

    public Integer getOrdineStatie() { return ordineStatie; }
    public void setOrdineStatie(Integer ordineStatie) { this.ordineStatie = ordineStatie; }
}