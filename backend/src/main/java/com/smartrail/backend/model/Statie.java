package com.smartrail.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Statii")
public class Statie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nume_statie")
    private String numeStatie;

    public Statie() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNumeStatie() { return numeStatie; }
    public void setNumeStatie(String numeStatie) { this.numeStatie = numeStatie; }
}