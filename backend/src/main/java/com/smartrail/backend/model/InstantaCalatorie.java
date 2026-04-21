package com.smartrail.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Instante_Calatorie")
public class InstantaCalatorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_instanta")
    private Integer idInstanta;

    @ManyToOne
    @JoinColumn(name = "ruta_id")
    private RutaProgramata rutaProgramata;

    @Column(name = "data_calatoriei")
    private LocalDate dataCalatoriei;

    @Column(name = "stare")
    private String stare;

    @Column(name = "intarziere_minute")
    private Integer intarziereMinute;

    @Column(name = "locuri_disponibile_actual")
    private Integer locuriDisponibileActual;

    public InstantaCalatorie() {}

    public Integer getIdInstanta() { return idInstanta; }
    public void setIdInstanta(Integer idInstanta) { this.idInstanta = idInstanta; }

    public RutaProgramata getRutaProgramata() { return rutaProgramata; }
    public void setRutaProgramata(RutaProgramata rutaProgramata) { this.rutaProgramata = rutaProgramata; }

    public LocalDate getDataCalatoriei() { return dataCalatoriei; }
    public void setDataCalatoriei(LocalDate dataCalatoriei) { this.dataCalatoriei = dataCalatoriei; }

    public String getStare() { return stare; }
    public void setStare(String stare) { this.stare = stare; }

    public Integer getIntarziereMinute() { return intarziereMinute; }
    public void setIntarziereMinute(Integer intarziereMinute) { this.intarziereMinute = intarziereMinute; }

    public Integer getLocuriDisponibileActual() { return locuriDisponibileActual; }
    public void setLocuriDisponibileActual(Integer locuriDisponibileActual) { this.locuriDisponibileActual = locuriDisponibileActual; }
}