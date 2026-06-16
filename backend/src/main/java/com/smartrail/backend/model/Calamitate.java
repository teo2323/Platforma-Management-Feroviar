package com.smartrail.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Calamitate {
    private String numeStatie;
    private String tipCalamitate;
    private String icon;
    private BigDecimal latitudine;
    private BigDecimal longitudine;
    private LocalDateTime dataAparitie;

    public Calamitate() {}

    public Calamitate(String numeStatie, String tipCalamitate, String icon, BigDecimal latitudine, BigDecimal longitudine) {
        this.numeStatie = numeStatie;
        this.tipCalamitate = tipCalamitate;
        this.icon = icon;
        this.latitudine = latitudine;
        this.longitudine = longitudine;
        this.dataAparitie = LocalDateTime.now();
    }

    public String getNumeStatie() { return numeStatie; }
    public void setNumeStatie(String numeStatie) { this.numeStatie = numeStatie; }

    public String getTipCalamitate() { return tipCalamitate; }
    public void setTipCalamitate(String tipCalamitate) { this.tipCalamitate = tipCalamitate; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public BigDecimal getLatitudine() { return latitudine; }
    public void setLatitudine(BigDecimal latitudine) { this.latitudine = latitudine; }

    public BigDecimal getLongitudine() { return longitudine; }
    public void setLongitudine(BigDecimal longitudine) { this.longitudine = longitudine; }

    public LocalDateTime getDataAparitie() { return dataAparitie; }
    public void setDataAparitie(LocalDateTime dataAparitie) { this.dataAparitie = dataAparitie; }
}
