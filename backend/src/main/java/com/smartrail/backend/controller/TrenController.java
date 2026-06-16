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

    @Autowired
    private com.smartrail.backend.service.AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<java.util.Map<String, String>> chatDespreVagoane(@RequestBody java.util.Map<String, String> request) {
        String intrebare = request.get("message");
        if (intrebare == null || intrebare.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Mesajul utilizatorului lipseste."));
        }

        List<Tren> trenuri = trenRepository.findAll();
        StringBuilder fleetData = new StringBuilder("Iata componenta curenta a trenurilor din baza de date:\n");
        for (Tren t : trenuri) {
            fleetData.append("- Trenul ").append(t.getIdTren())
                     .append(" (tip: ").append(t.getTipTren())
                     .append(", capacitate totala: ").append(t.getCapacitateTotala())
                     .append(" locuri) are vagoanele:\n");
            if (t.getVagoane() == null || t.getVagoane().isEmpty()) {
                fleetData.append("  (nu are vagoane inregistrate)\n");
            } else {
                for (com.smartrail.backend.model.VagonTren v : t.getVagoane()) {
                    fleetData.append("  * Vagonul ").append(v.getNumarVagon())
                             .append(": Clasa ").append(v.getClasa())
                             .append(", ").append(v.getNumarLocuri()).append(" locuri, facilitati: ")
                             .append(v.getFacilitati() != null ? String.join(", ", v.getFacilitati()) : "niciuna")
                             .append("\n");
                }
            }
        }

        String prompt = "Esti un asistent virtual specializat in informatii feroviare pentru platforma SmartRail.\n" +
                "Raspunde politicos, clar si la obiect la intrebarea utilizatorului, folosind exclusiv datele furnizate mai jos. Daca informatia ceruta nu se regaseste in date, raspunde politicos spunand asta.\n\n" +
                fleetData.toString() + "\n" +
                "Intrebarea utilizatorului: " + intrebare + "\n\n" +
                "Raspuns (in limba romana):";

        String aiResponse = aiService.genereazaAnaliza(prompt);
        return ResponseEntity.ok(java.util.Map.of("response", aiResponse));
    }
}