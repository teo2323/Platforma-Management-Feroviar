package com.smartrail.backend.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Trenuri")
public class Tren {

    @Id
    @Column(name = "id_tren")
    private String idTren;

    @Column(name = "tip_tren")
    private String tipTren;

    @Column(name = "capacitate_totala")
    private Integer capacitateTotala;

    @OneToMany(mappedBy = "tren", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("tren")
    private List<VagonTren> vagoane;

    public Tren() {}


    public String getIdTren() { return idTren; }
    public void setIdTren(String idTren) { this.idTren = idTren; }

    public String getTipTren() { return tipTren; }
    public void setTipTren(String tipTren) { this.tipTren = tipTren; }

    public Integer getCapacitateTotala() { return capacitateTotala; }
    public void setCapacitateTotala(Integer capacitateTotala) { this.capacitateTotala = capacitateTotala; }

    public List<VagonTren> getVagoane() { return vagoane; }
    public void setVagoane(List<VagonTren> vagoane) { this.vagoane = vagoane; }
}