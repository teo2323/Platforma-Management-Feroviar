package com.smartrail.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Alerte_Live")
public class AlertaLive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alerta")
    private Integer idAlerta;

    @ManyToOne
    @JoinColumn(name = "instanta_id")
    private InstantaCalatorie instantaCalatorie;

    @ManyToOne
    @JoinColumn(name = "oprire_afectata_id")
    private OprireTraseu oprireAfectata;

    @Column(name = "tip_incident")
    private String tipIncident;

    @Column(name = "stare_alerta")
    private String stareAlerta;

    public AlertaLive() {}

    public Integer getIdAlerta() { return idAlerta; }
    public void setIdAlerta(Integer idAlerta) { this.idAlerta = idAlerta; }

    public InstantaCalatorie getInstantaCalatorie() { return instantaCalatorie; }
    public void setInstantaCalatorie(InstantaCalatorie instantaCalatorie) { this.instantaCalatorie = instantaCalatorie; }

    public OprireTraseu getOprireAfectata() { return oprireAfectata; }
    public void setOprireAfectata(OprireTraseu oprireAfectata) { this.oprireAfectata = oprireAfectata; }

    public String getTipIncident() { return tipIncident; }
    public void setTipIncident(String tipIncident) { this.tipIncident = tipIncident; }

    public String getStareAlerta() { return stareAlerta; }
    public void setStareAlerta(String stareAlerta) { this.stareAlerta = stareAlerta; }
}