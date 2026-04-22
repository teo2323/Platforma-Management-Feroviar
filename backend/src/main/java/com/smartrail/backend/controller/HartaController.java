package com.smartrail.backend.controller;

import com.smartrail.backend.model.StatusGPSLive;
import com.smartrail.backend.repository.StatusGPSLiveRepository;
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


    @GetMapping("/live")
    public List<StatusGPSLive> getTrenuriLive() {

        return statusGPSRepository.findByInstantaCalatorieStare("IN_CURS");
    }
}