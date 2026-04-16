package com.smartrail.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

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


    public Tren() {}


    public String getIdTren() { return idTren; }
    public void setIdTren(String idTren) { this.idTren = idTren; }

    public String getTipTren() { return tipTren; }
    public void setTipTren(String tipTren) { this.tipTren = tipTren; }

    public Integer getCapacitateTotala() { return capacitateTotala; }
    public void setCapacitateTotala(Integer capacitateTotala) { this.capacitateTotala = capacitateTotala; }
}