package com.smartrail.backend.controller;

import com.smartrail.backend.model.RutaProgramata;
import com.smartrail.backend.repository.RutaProgramataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rute")
@CrossOrigin(origins = "*")
public class RutaController {

    @Autowired
    private RutaProgramataRepository rutaRepository;

    @GetMapping("/cauta")
    public List<RutaProgramata> cautaRute(
            @RequestParam String plecare,
            @RequestParam String destinatie) {

        return rutaRepository.gasesteRuteValide(plecare, destinatie);
    }

    @GetMapping("/toate")
    public List<RutaProgramata> getToateRutele() {
        return rutaRepository.findAll();
    }
}