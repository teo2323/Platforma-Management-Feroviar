package com.smartrail.backend.controller;

import com.smartrail.backend.model.Statie;
import com.smartrail.backend.repository.StatieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/statii")
@CrossOrigin(origins = "*")
public class StatieController {

    @Autowired
    private StatieRepository statieRepository;

    @GetMapping
    public List<Statie> getToateStatiile() {
        return statieRepository.findAll();
    }
}