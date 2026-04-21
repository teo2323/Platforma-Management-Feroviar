package com.smartrail.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Status_GPS_Live")
public class StatusGPSLive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "instanta_id")
    private InstantaCalatorie instantaCalatorie;

    @Column(name = "latitudine", precision = 9, scale = 6)
    private BigDecimal latitudine;

    @Column(name = "longitudine", precision = 9, scale = 6)
    private BigDecimal longitudine;

    @Column(name = "ultima_actualizare", insertable = false, updatable = false)
    private LocalDateTime ultimaActualizare;

    public StatusGPSLive() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public InstantaCalatorie getInstantaCalatorie() { return instantaCalatorie; }
    public void setInstantaCalatorie(InstantaCalatorie instantaCalatorie) { this.instantaCalatorie = instantaCalatorie; }

    public BigDecimal getLatitudine() { return latitudine; }
    public void setLatitudine(BigDecimal latitudine) { this.latitudine = latitudine; }

    public BigDecimal getLongitudine() { return longitudine; }
    public void setLongitudine(BigDecimal longitudine) { this.longitudine = longitudine; }

    public LocalDateTime getUltimaActualizare() { return ultimaActualizare; }
    public void setUltimaActualizare(LocalDateTime ultimaActualizare) { this.ultimaActualizare = ultimaActualizare; }
}