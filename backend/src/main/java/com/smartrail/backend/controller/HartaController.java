package com.smartrail.backend.controller;

import com.smartrail.backend.model.StatusGPSLive;
import com.smartrail.backend.repository.StatusGPSLiveRepository;
import com.smartrail.backend.service.GpsSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/harta")
@CrossOrigin(origins = "*")
public class HartaController {

    @Autowired
    private StatusGPSLiveRepository statusGPSRepository;

    @Autowired
    private GpsSimulationService gpsSimulationService;

    @GetMapping("/live")
    public List<StatusGPSLive> getTrenuriLive() {
        List<StatusGPSLive> liveList = statusGPSRepository.findByInstantaCalatorieStare("IN_CURS");
        for (StatusGPSLive gps : liveList) {
            if (gps.getInstantaCalatorie() != null) {
                Integer instantaId = gps.getInstantaCalatorie().getIdInstanta();
                gps.setViteza(gpsSimulationService.getViteza(instantaId));
                gps.setUltimaStatie(gpsSimulationService.getUltimaStatie(instantaId));
                gps.setUrmatoareaStatie(gpsSimulationService.getUrmatoareaStatie(instantaId));
            }
        }
        return liveList;
    }
}