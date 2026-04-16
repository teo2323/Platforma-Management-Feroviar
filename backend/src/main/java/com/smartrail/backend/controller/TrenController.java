package com.smartrail.backend.controller;

import com.smartrail.backend.model.Tren;
import com.smartrail.backend.repository.TrenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trenuri")
public class TrenController {


    @Autowired
    private TrenRepository trenRepository;

    @GetMapping("/search")
    public List<Tren> getTrenuri() {

        return trenRepository.findAll();
    }
}