package com.smartrail.backend.controller;

import com.smartrail.backend.model.InstantaCalatorie;
import com.smartrail.backend.model.RutaProgramata;
import com.smartrail.backend.repository.InstantaCalatorieRepository;
import com.smartrail.backend.repository.RutaProgramataRepository;
import com.smartrail.backend.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rute")
@CrossOrigin(origins = "*")
public class RutaController {

    @Autowired
    private RutaProgramataRepository rutaRepository;

    @Autowired
    private InstantaCalatorieRepository instantaRepository;

    @Autowired
    private AiService aiService;

    @GetMapping("/cauta")
    public List<RutaProgramata> cautaRute(
            @RequestParam String plecare,
            @RequestParam String destinatie) {

        List<RutaProgramata> rute = rutaRepository.gasesteRuteValide(plecare, destinatie);

        for (RutaProgramata ruta : rute) {
            List<InstantaCalatorie> istoric = instantaRepository.findByRutaProgramata_IdRuta(ruta.getIdRuta());

            StringBuilder dateBrute = new StringBuilder();
            int curseAnalizate = 0;
            int totalMinute = 0;
            int minIntarziere = Integer.MAX_VALUE;
            int maxIntarziere = 0;

            for (InstantaCalatorie instanta : istoric) {
                if ("FINALIZAT".equals(instanta.getStare())) {
                    int minute = instanta.getIntarziereMinute();

                    totalMinute += minute;
                    if (minute < minIntarziere) minIntarziere = minute;
                    if (minute > maxIntarziere) maxIntarziere = minute;

                    dateBrute.append("[Data: ").append(instanta.getDataCalatoriei())
                            .append(", Intarziere: ").append(minute).append(" min");

                    List<String> cauze = instantaRepository.gasesteAlertePentruInstanta(instanta.getIdInstanta());
                    if (!cauze.isEmpty()) {
                        dateBrute.append(", Cauze: ").append(String.join(", ", cauze));
                    }

                    dateBrute.append("] ");
                    curseAnalizate++;
                }
            }

            String prompt;
            if (curseAnalizate == 0) {
                prompt = "Scrie un mesaj scurt (max 15 cuvinte) cu drum bun pentru ruta " + plecare + " - " + destinatie + ".";
            } else {
                int medieIntarziere = totalMinute / curseAnalizate;

                prompt = "Esti analist de risc feroviar pentru ruta " + plecare + " -> " + destinatie + ". " +
                        "Date statistice exacte: intarziere minima " + minIntarziere + " min, medie " + medieIntarziere + " min, maxima " + maxIntarziere + " min. " +
                        "Istoric detaliat pentru tipare: " + dateBrute.toString() + " " +
                        "Scrie o singura propozitie (maxim 35 cuvinte) pentru un pasager. REGULA STRICTA: Include in text OBLIGATORIU cele 3 valori numerice (minima, medie, maxima) si adauga o concluzie inteligenta observand tiparele din istoric (ex: iarna sunt probleme din cauza zapezii).";
            }

            String analizaAi = aiService.genereazaAnaliza(prompt);
            ruta.setRecomandareAi(analizaAi.replace("\n", " ").trim());

            try {
                Thread.sleep(1500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        return rute;
    }
}