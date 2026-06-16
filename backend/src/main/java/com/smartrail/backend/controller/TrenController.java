package com.smartrail.backend.controller;

import com.smartrail.backend.model.Tren;
import com.smartrail.backend.repository.TrenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trenuri")
@CrossOrigin(origins = "*")
public class TrenController {

    @Autowired
    private TrenRepository trenRepository;

    @GetMapping
    public List<Tren> getTrenuri() {
        return trenRepository.findAll();
    }

    @GetMapping("/search")
    public List<Tren> searchTrenuri() {
        return trenRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tren> getTrenById(@PathVariable String id) {
        return trenRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}