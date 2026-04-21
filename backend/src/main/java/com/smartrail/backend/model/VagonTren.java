package com.smartrail.backend.model;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Vagoane_Tren")
public class VagonTren {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_vagon;

    @ManyToOne
    @JoinColumn(name = "tren_id")
    private Tren tren;

    @Column(name = "numar_vagon")
    private Integer numarVagon;

    @Column(name = "clasa")
    private Integer clasa;

    @Column(name = "numar_locuri")
    private Integer numarLocuri;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "facilitati", columnDefinition = "text[]")
    private List<String> facilitati;


    public VagonTren() {}

    public Integer getId_vagon() { return id_vagon; }
    public void setId_vagon(Integer id_vagon) { this.id_vagon = id_vagon; }

    public Tren getTren() { return tren; }
    public void setTren(Tren tren) { this.tren = tren; }

    public Integer getNumarVagon() { return numarVagon; }
    public void setNumarVagon(Integer numarVagon) { this.numarVagon = numarVagon; }

    public Integer getClasa() { return clasa; }
    public void setClasa(Integer clasa) { this.clasa = clasa; }

    public Integer getNumarLocuri() { return numarLocuri; }
    public void setNumarLocuri(Integer numarLocuri) { this.numarLocuri = numarLocuri; }

    public List<String> getFacilitati() { return facilitati; }
    public void setFacilitati(List<String> facilitati) { this.facilitati = facilitati; }
}