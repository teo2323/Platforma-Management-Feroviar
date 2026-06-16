package com.smartrail.backend.controller;

import com.smartrail.backend.model.InstantaCalatorie;
import com.smartrail.backend.model.RutaProgramata;
import com.smartrail.backend.model.OprireTraseu;
import com.smartrail.backend.model.Calamitate;
import com.smartrail.backend.model.SearchResultDto;
import com.smartrail.backend.repository.InstantaCalatorieRepository;
import com.smartrail.backend.repository.RutaProgramataRepository;
import com.smartrail.backend.service.AiService;
import com.smartrail.backend.service.CalamitateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

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

    @Autowired
    private CalamitateService calamitateService;

    @GetMapping("/cauta")
    public SearchResultDto cautaRute(
            @RequestParam String plecare,
            @RequestParam String destinatie) {

        List<RutaProgramata> rute = rutaRepository.gasesteRuteValide(plecare, destinatie);

        StringBuilder routesInfoBuilder = new StringBuilder();
        Set<Calamitate> calamitatiRelevante = new HashSet<>();

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
            String analizaAiCurata = analizaAi.replace("\n", " ").trim();
            ruta.setRecomandareAi(analizaAiCurata);

            routesInfoBuilder.append("- Tren: ").append(ruta.getTren().getIdTren())
                    .append(" (").append(ruta.getTren().getTipTren()).append("), ")
                    .append("Analiză AI: ").append(analizaAiCurata).append("\n");

            if (ruta.getOpriri() != null) {
                for (OprireTraseu oprire : ruta.getOpriri()) {
                    String numeStatie = oprire.getStatie().getNumeStatie();
                    Calamitate cal = calamitateService.getCalamitatePentruStatie(numeStatie);
                    if (cal != null) {
                        calamitatiRelevante.add(cal);
                    }
                }
            }

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        StringBuilder calamitiesBuilder = new StringBuilder();
        if (calamitatiRelevante.isEmpty()) {
            calamitiesBuilder.append("Nu există calamități active pe stațiile acestor rute.\n");
        } else {
            for (Calamitate cal : calamitatiRelevante) {
                calamitiesBuilder.append("- În stația ").append(cal.getNumeStatie())
                        .append(" este semnalată calamitatea: ").append(cal.getTipCalamitate())
                        .append(" (").append(cal.getIcon()).append(")\n");
            }
        }

        String expertizaGenerala = "Nu s-au putut genera recomandări din lipsă de rute active.";
        if (!rute.isEmpty()) {
            LocalDate today = LocalDate.now();
            String season = getSeason(today);
            String dateStr = today.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

            String secondPrompt = "[INST] Ești un expert coordonator de trafic feroviar. Rolul tău este să compari toate rutele disponibile pentru călătoria de la " 
                    + plecare + " la " + destinatie + " și să oferi o recomandare generală consolidată pentru pasager.\n"
                    + "Data curentă a călătoriei: " + dateStr + " (Sezonul curent: " + season + ").\n\n"
                    + "Iată rutele disponibile cu analizele lor individuale (ce contin statistici si tipare):\n"
                    + routesInfoBuilder.toString() + "\n"
                    + "Calamități active în stații pe traseu:\n"
                    + calamitiesBuilder.toString() + "\n"
                    + "Sarcina ta:\n"
                    + "1. Analizează rutele și corelează tiparele lor din istoricul primului AI (ex: întârzieri iarna) cu sezonul curent (" + season + ").\n"
                    + "2. Verifică dacă vreo rută trece prin stații afectate de calamități. Dacă da, avertizează ferm pasagerul despre riscul de întârziere majoră și recomandă evitarea acelei rute sau tren.\n"
                    + "3. Oferă un verdict clar și o recomandare precisă: care tren este cea mai bună opțiune în acest moment și de ce.\n\n"
                    + "Răspunde direct, în limba română, într-o singură secțiune/paragraf, în maxim 85 de cuvinte. Nu folosi formule introductive formale precum 'În calitate de expert...'. Fii concis și direct. [/INST]";

            try {
                expertizaGenerala = aiService.genereazaAnaliza(secondPrompt);
            } catch (Exception e) {
                System.err.println("Eroare generare expertiza generala AI: " + e.getMessage());
                expertizaGenerala = "Recomandare generală indisponibilă momentan.";
            }
        }

        return new SearchResultDto(rute, expertizaGenerala.replace("\n", " ").trim());
    }

    private String getSeason(LocalDate date) {
        int month = date.getMonthValue();
        if (month == 12 || month == 1 || month == 2) {
            return "Iarnă";
        } else if (month >= 3 && month <= 5) {
            return "Primăvară";
        } else if (month >= 6 && month <= 8) {
            return "Vară";
        } else {
            return "Toamnă";
        }
    }
}