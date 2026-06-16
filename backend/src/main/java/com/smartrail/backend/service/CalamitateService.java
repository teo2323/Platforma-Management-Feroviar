package com.smartrail.backend.service;

import com.smartrail.backend.model.Calamitate;
import com.smartrail.backend.model.Statie;
import com.smartrail.backend.repository.StatieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class CalamitateService {

    @Autowired
    private StatieRepository statieRepository;

    private final List<Calamitate> activeCalamitati = new CopyOnWriteArrayList<>();

    private static final Map<String, Coordinate> COORDONATE_STATII = new HashMap<>();

    private static class Coordinate {
        final double lat;
        final double lon;

        Coordinate(double lat, double lon) {
            this.lat = lat;
            this.lon = lon;
        }
    }

    static {
        COORDONATE_STATII.put("Bucuresti Nord", new Coordinate(44.4468, 26.0750));
        COORDONATE_STATII.put("Ploiesti Vest", new Coordinate(44.9257, 25.9928));
        COORDONATE_STATII.put("Sinaia", new Coordinate(45.3552, 25.5539));
        COORDONATE_STATII.put("Predeal", new Coordinate(45.5036, 25.5786));
        COORDONATE_STATII.put("Brasov", new Coordinate(45.6525, 25.6111));
        COORDONATE_STATII.put("Constanta", new Coordinate(44.1792, 28.6498));
        COORDONATE_STATII.put("Fetesti", new Coordinate(44.3820, 27.8286));
        COORDONATE_STATII.put("Fagaras", new Coordinate(45.8416, 24.9734));
        COORDONATE_STATII.put("Sibiu", new Coordinate(45.7983, 24.1614));
        COORDONATE_STATII.put("Deva", new Coordinate(45.8824, 22.9069));
        COORDONATE_STATII.put("Arad", new Coordinate(46.1866, 21.3123));
        COORDONATE_STATII.put("Timisoara", new Coordinate(45.7504, 21.2257));
        COORDONATE_STATII.put("Rosiori Nord", new Coordinate(44.1207, 24.9847));
        COORDONATE_STATII.put("Craiova", new Coordinate(44.3302, 23.8185));
        COORDONATE_STATII.put("Drobeta-Turnu Severin", new Coordinate(44.6259, 22.6566));
        COORDONATE_STATII.put("Caransebes", new Coordinate(45.4190, 22.2037));
        COORDONATE_STATII.put("Cluj-Napoca", new Coordinate(46.7772, 23.5898));
        COORDONATE_STATII.put("Oradea", new Coordinate(47.0735, 21.9406));
        COORDONATE_STATII.put("Satu Mare", new Coordinate(47.7884, 22.8870));
    }

    private static final List<String[]> TIPURI_CALAMITATI = Arrays.asList(
        new String[]{"NINSORI_ABUNDENTE", "❄️"},
        new String[]{"FURTUNA", "⛈️"},
        new String[]{"INUNDATIE", "🌊"},
        new String[]{"ALUNECARI_DE_TEREN", "⛰️"},
        new String[]{"ZAPADA_PE_LINIE", "⛄"},
        new String[]{"TEMPERATURI_EXTREME", "🔥"},
        new String[]{"COPACI_CAZUTI", "🌲"}
    );

    @PostConstruct
    public void init() {
        genereazaCalamitatiRandom();
    }

    public List<Calamitate> getActiveCalamitati() {
        return new ArrayList<>(activeCalamitati);
    }

    @Scheduled(fixedDelay = 60000)
    public void scheduledReset() {
        System.out.println("Resetare periodica a calamitatilor...");
        genereazaCalamitatiRandom();
    }

    public synchronized void genereazaCalamitatiRandom() {
        activeCalamitati.clear();
        List<Statie> toateStatiile = statieRepository.findAll();
        if (toateStatiile.isEmpty()) {
            return;
        }

        Random rand = new Random();
        for (Statie statie : toateStatiile) {
            if (rand.nextDouble() < 0.20) {
                creeazaCalamitatePentruStatie(statie, rand);
            }
        }

        if (activeCalamitati.isEmpty()) {
            Statie randomStatie = toateStatiile.get(rand.nextInt(toateStatiile.size()));
            creeazaCalamitatePentruStatie(randomStatie, rand);
        }

        System.out.println("S-au generat " + activeCalamitati.size() + " calamitati active.");
    }

    private void creeazaCalamitatePentruStatie(Statie statie, Random rand) {
        String[] tip = TIPURI_CALAMITATI.get(rand.nextInt(TIPURI_CALAMITATI.size()));
        Coordinate coord = COORDONATE_STATII.getOrDefault(statie.getNumeStatie(), new Coordinate(45.9432, 24.9668));
        
        Calamitate cal = new Calamitate(
            statie.getNumeStatie(),
            tip[0],
            tip[1],
            BigDecimal.valueOf(coord.lat),
            BigDecimal.valueOf(coord.lon)
        );
        activeCalamitati.add(cal);
    }

    public Calamitate getCalamitatePentruStatie(String numeStatie) {
        return activeCalamitati.stream()
            .filter(c -> c.getNumeStatie().equalsIgnoreCase(numeStatie))
            .findFirst()
            .orElse(null);
    }
}
