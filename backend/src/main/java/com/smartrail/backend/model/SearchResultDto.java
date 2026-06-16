package com.smartrail.backend.model;

import java.util.List;

public class SearchResultDto {
    private List<RutaProgramata> rute;
    private String expertizaGenerala;

    public SearchResultDto() {}

    public SearchResultDto(List<RutaProgramata> rute, String expertizaGenerala) {
        this.rute = rute;
        this.expertizaGenerala = expertizaGenerala;
    }

    public List<RutaProgramata> getRute() { return rute; }
    public void setRute(List<RutaProgramata> rute) { this.rute = rute; }

    public String getExpertizaGenerala() { return expertizaGenerala; }
    public void setExpertizaGenerala(String expertizaGenerala) { this.expertizaGenerala = expertizaGenerala; }
}
