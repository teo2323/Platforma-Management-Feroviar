package com.smartrail.backend.controller;

import com.smartrail.backend.model.Calamitate;
import com.smartrail.backend.service.CalamitateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calamitati")
@CrossOrigin(origins = "*")
public class CalamitateController {

    @Autowired
    private CalamitateService calamitateService;

    @GetMapping
    public List<Calamitate> getCalamitati() {
        return calamitateService.getActiveCalamitati();
    }

    @PostMapping("/reset")
    public List<Calamitate> resetCalamitati() {
        calamitateService.genereazaCalamitatiRandom();
        return calamitateService.getActiveCalamitati();
    }
}
