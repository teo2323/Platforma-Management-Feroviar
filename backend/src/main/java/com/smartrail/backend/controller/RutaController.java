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
                prompt = "[INST] Scrie un mesaj scurt (max 15 cuvinte) cu drum bun pentru ruta " + plecare + " - " + destinatie + ". [/INST]";
            } else {
                int medieIntarziere = totalMinute / curseAnalizate;

                prompt = "[INST] Ești un asistent de călătorie inteligent. Analizează istoricul curselor și răspunde în limba română printr-o singură propoziție scurtă (maxim 30 de cuvinte) adresată pasagerului.\n" +
                        "Trebuie să incluzi obligatoriu:\n" +
                        "1. Valorile statistice exacte: minim " + minIntarziere + " min, medie " + medieIntarziere + " min, maxim " + maxIntarziere + " min de întârziere.\n" +
                        "2. O concluzie scurtă bazată pe un tipar observat în istoricul curselor (ex: întârzieri mari iarna, probleme în weekend-uri sau risc de copaci căzuți).\n\n" +
                        "Date statistice:\n" +
                        "- Ruta: " + plecare + " - " + destinatie + "\n" +
                        "- Minimă: " + minIntarziere + " min, Medie: " + medieIntarziere + " min, Maximă: " + maxIntarziere + " min\n" +
                        "- Istoric detaliat: " + dateBrute.toString().trim() + "\n\n" +
                        "Format dorit: \"Întârzierea pe această rută este de minim [minim] min, medie [medie] min și maxim [maxim] min; observăm că [tipar/concluzie din istoric].\"\n" +
                        "Răspunsul tău exact în acest format: [/INST]";
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