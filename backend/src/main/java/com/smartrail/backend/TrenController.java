package com.smartrail.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trenuri")
@CrossOrigin(origins = "*")
public class TrenController {

    @GetMapping("/search")
    public String searchTrenuri() {
        return """
            [
              {
                "id_tren": "IR-1633",
                "tip_tren": "InterRegio",
                "ruta": {
                  "statie_plecare": "București Nord", "statie_destinatie": "Brașov",
                  "opriri_intermediare": [
                    { "statie": "Ploiești Vest", "ora_sosire": "09:40", "ora_plecare": "09:42" },
                    { "statie": "Sinaia", "ora_sosire": "10:30", "ora_plecare": "10:32" }
                  ]
                },
                "status_live": { "intarziere_minute": 15, "locuri_disponibile_actual": 45, "capacitate_totala_tren": 200 },
                "recomandare_ai": "⚠️ Risc de întârziere ridicat la intrarea în Brașov. Recomandat doar dacă nu aveți legături strânse."
              },
              {
                "id_tren": "R-3001",
                "tip_tren": "Regio",
                "ruta": {
                  "statie_plecare": "București Nord", "statie_destinatie": "Brașov",
                  "opriri_intermediare": [
                    { "statie": "Buftea", "ora_sosire": "08:15", "ora_plecare": "08:16" },
                    { "statie": "Ploiești Vest", "ora_sosire": "09:00", "ora_plecare": "09:05" },
                    { "statie": "Comarnic", "ora_sosire": "09:45", "ora_plecare": "09:46" },
                    { "statie": "Sinaia", "ora_sosire": "10:10", "ora_plecare": "10:12" }
                  ]
                },
                "status_live": { "intarziere_minute": 0, "locuri_disponibile_actual": 120, "capacitate_totala_tren": 300 },
                "recomandare_ai": "✅ Foarte punctual, dar oprește în toate stațiile. Ideal pentru buget redus."
              },
              {
                "id_tren": "IC-531",
                "tip_tren": "InterCity",
                "ruta": {
                  "statie_plecare": "București Nord", "statie_destinatie": "Brașov",
                  "opriri_intermediare": [
                    { "statie": "Brașov", "ora_sosire": "11:00", "ora_plecare": "11:00" }
                  ]
                },
                "status_live": { "intarziere_minute": 2, "locuri_disponibile_actual": 10, "capacitate_totala_tren": 150 },
                "recomandare_ai": "🌟 Cea mai bună opțiune. Rapid și confortabil. Locuri limitate!"
              }
            ]
            """;
    }
}