package com.smartrail.backend.service;

import com.smartrail.backend.model.*;
import com.smartrail.backend.repository.InstantaCalatorieRepository;
import com.smartrail.backend.repository.StatusGPSLiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GpsSimulationService {

    @Autowired
    private InstantaCalatorieRepository instantaRepository;

    @Autowired
    private StatusGPSLiveRepository gpsRepository;

    @Autowired
    private CalamitateService calamitateService;

    private final Map<Integer, Integer> instantaIdToVitezaMap = new ConcurrentHashMap<>();
    private final Map<Integer, String> instantaIdToUltimaStatieMap = new ConcurrentHashMap<>();
    private final Map<Integer, String> instantaIdToUrmatoareaStatieMap = new ConcurrentHashMap<>();

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
        COORDONATE_STATII.put("Iasi", new Coordinate(47.1585, 27.6014));
        COORDONATE_STATII.put("Pascani", new Coordinate(47.2500, 26.7167));
        COORDONATE_STATII.put("Suceava", new Coordinate(47.6514, 26.2556));
        COORDONATE_STATII.put("Bacau", new Coordinate(46.5688, 26.9159));
        COORDONATE_STATII.put("Focsani", new Coordinate(45.7001, 27.1820));
        COORDONATE_STATII.put("Buzau", new Coordinate(45.1516, 26.8167));
        COORDONATE_STATII.put("Galati", new Coordinate(45.4353, 28.0553));
        COORDONATE_STATII.put("Braila", new Coordinate(45.2692, 27.9575));
        COORDONATE_STATII.put("Baia Mare", new Coordinate(47.6533, 23.5794));
        COORDONATE_STATII.put("Dej Calatori", new Coordinate(47.1492, 23.8694));
    }

    public Integer getViteza(Integer instantaId) {
        return instantaIdToVitezaMap.getOrDefault(instantaId, 0);
    }

    public String getUltimaStatie(Integer instantaId) {
        return instantaIdToUltimaStatieMap.getOrDefault(instantaId, "N/A");
    }

    public String getUrmatoareaStatie(Integer instantaId) {
        return instantaIdToUrmatoareaStatieMap.getOrDefault(instantaId, "N/A");
    }

    // Runs simulation every 5 seconds
    @Transactional
    @Scheduled(fixedDelay = 5000)
    public void simuleazaPozitiiGps() {
        List<InstantaCalatorie> activeInstante = instantaRepository.findByStare("IN_CURS");
        if (activeInstante.isEmpty()) {
            return;
        }

        List<StatusGPSLive> gpsRecords = gpsRepository.findAll();

        for (InstantaCalatorie instanta : activeInstante) {
            try {
                StatusGPSLive targetGps = gpsRecords.stream()
                        .filter(g -> g.getInstantaCalatorie() != null && g.getInstantaCalatorie().getIdInstanta().equals(instanta.getIdInstanta()))
                        .findFirst()
                        .orElse(null);

                RutaProgramata ruta = instanta.getRutaProgramata();
                if (ruta == null || ruta.getOpriri() == null || ruta.getOpriri().size() < 2) {
                    continue;
                }

                List<OprireTraseu> opriri = new ArrayList<>(ruta.getOpriri());
                opriri.sort(Comparator.comparingInt(OprireTraseu::getOrdineStatie));

                LocalTime logicalTime = LocalTime.now();
                int delay = instanta.getIntarziereMinute();

                // Get overall start and end times
                LocalTime departureStart = opriri.get(0).getOraPlecare();
                LocalTime arrivalEnd = opriri.get(opriri.size() - 1).getOraSosire();

                // Simulation helper: If current time is outside the schedule, we loop the time for demonstration
                boolean outsideSchedule = logicalTime.isBefore(departureStart) || logicalTime.isAfter(arrivalEnd);
                if (outsideSchedule) {
                    long startSec = departureStart.toSecondOfDay();
                    long endSec = arrivalEnd.toSecondOfDay();
                    long durationSec = endSec - startSec;
                    if (durationSec > 0) {
                        long elapsedSec = (System.currentTimeMillis() / 1000) % durationSec;
                        logicalTime = LocalTime.ofSecondOfDay(startSec + elapsedSec);
                    } else {
                        logicalTime = departureStart;
                    }
                } else {
                    // Apply delay to logical time: a delayed train is at the place it should have been 'delay' minutes ago
                    logicalTime = logicalTime.minusMinutes(delay);
                    if (logicalTime.isBefore(departureStart)) {
                        logicalTime = departureStart;
                    }
                }

                double targetLat = 0;
                double targetLon = 0;
                int speed = 0;

                // Find where the train is at logicalTime
                if (logicalTime.isBefore(departureStart) || logicalTime.equals(departureStart)) {
                    String name = opriri.get(0).getStatie().getNumeStatie();
                    Coordinate c = COORDONATE_STATII.getOrDefault(name, new Coordinate(45.9432, 24.9668));
                    targetLat = c.lat;
                    targetLon = c.lon;
                    speed = 0;
                    instantaIdToUltimaStatieMap.put(instanta.getIdInstanta(), name);
                    if (opriri.size() > 1) {
                        instantaIdToUrmatoareaStatieMap.put(instanta.getIdInstanta(), opriri.get(1).getStatie().getNumeStatie());
                    } else {
                        instantaIdToUrmatoareaStatieMap.put(instanta.getIdInstanta(), "Destinație atinsă");
                    }
                } else if (logicalTime.isAfter(arrivalEnd) || logicalTime.equals(arrivalEnd)) {
                    String name = opriri.get(opriri.size() - 1).getStatie().getNumeStatie();
                    Coordinate c = COORDONATE_STATII.getOrDefault(name, new Coordinate(45.9432, 24.9668));
                    targetLat = c.lat;
                    targetLon = c.lon;
                    speed = 0;
                    instantaIdToUltimaStatieMap.put(instanta.getIdInstanta(), name);
                    instantaIdToUrmatoareaStatieMap.put(instanta.getIdInstanta(), "Destinație atinsă");
                    
                    if (!outsideSchedule) {
                        instanta.setStare("FINALIZAT");
                        instantaRepository.save(instanta);
                        System.out.println("Instanta de calatorie " + instanta.getIdInstanta() + " s-a incheiat (FINALIZAT).");
                    }
                } else {
                    for (int i = 0; i < opriri.size() - 1; i++) {
                        OprireTraseu currentStop = opriri.get(i);
                        OprireTraseu nextStop = opriri.get(i + 1);

                        LocalTime depTime = currentStop.getOraPlecare();
                        LocalTime arrTime = nextStop.getOraSosire();

                        if (logicalTime.isAfter(depTime) && logicalTime.isBefore(arrTime)) {
                            String nameStart = currentStop.getStatie().getNumeStatie();
                            String nameEnd = nextStop.getStatie().getNumeStatie();
                            instantaIdToUltimaStatieMap.put(instanta.getIdInstanta(), nameStart);
                            instantaIdToUrmatoareaStatieMap.put(instanta.getIdInstanta(), nameEnd);

                            Coordinate cStart = COORDONATE_STATII.getOrDefault(nameStart, new Coordinate(45.9432, 24.9668));
                            Coordinate cEnd = COORDONATE_STATII.getOrDefault(nameEnd, new Coordinate(45.9432, 24.9668));

                            long totalDuration = Duration.between(depTime, arrTime).toSeconds();
                            long elapsed = Duration.between(depTime, logicalTime).toSeconds();
                            double ratio = totalDuration > 0 ? (double) elapsed / totalDuration : 1.0;

                            // Check if next station Y (nameEnd) has an active calamity
                            Calamitate calamity = calamitateService.getCalamitatePentruStatie(nameEnd);
                            if (calamity != null) {
                                speed = 0;
                                if (targetGps != null && targetGps.getLatitudine() != null && targetGps.getLongitudine() != null) {
                                    targetLat = targetGps.getLatitudine().doubleValue();
                                    targetLon = targetGps.getLongitudine().doubleValue();
                                } else {
                                    targetLat = cStart.lat + ratio * (cEnd.lat - cStart.lat);
                                    targetLon = cStart.lon + ratio * (cEnd.lon - cStart.lon);
                                }
                                System.out.println("SIMULARE GPS: Trenul " + (ruta.getTren() != null ? ruta.getTren().getIdTren() : instanta.getIdInstanta()) + 
                                        " este blocat. S-a oprit la coordonatele [" + targetLat + ", " + targetLon + "] din cauza calamitatii (" + 
                                        calamity.getTipCalamitate() + ") din statia " + nameEnd);
                            } else {
                                targetLat = cStart.lat + ratio * (cEnd.lat - cStart.lat);
                                targetLon = cStart.lon + ratio * (cEnd.lon - cStart.lon);

                                double distance = calculateDistance(cStart.lat, cStart.lon, cEnd.lat, cEnd.lon);
                                double hours = (double) totalDuration / 3600.0;
                                double speedDbl = hours > 0 ? distance / hours : 80;
                                speed = (int) speedDbl;

                                if (speed < 40) speed = 55;
                                if (speed > 140) speed = 120;
                            }
                            break;
                        } else if ((logicalTime.equals(arrTime) || logicalTime.isAfter(arrTime)) && 
                                   (logicalTime.equals(nextStop.getOraPlecare()) || logicalTime.isBefore(nextStop.getOraPlecare()))) {
                            String name = nextStop.getStatie().getNumeStatie();
                            Coordinate c = COORDONATE_STATII.getOrDefault(name, new Coordinate(45.9432, 24.9668));
                            targetLat = c.lat;
                            targetLon = c.lon;
                            speed = 0;
                            instantaIdToUltimaStatieMap.put(instanta.getIdInstanta(), name);
                            if (i + 2 < opriri.size()) {
                                instantaIdToUrmatoareaStatieMap.put(instanta.getIdInstanta(), opriri.get(i + 2).getStatie().getNumeStatie());
                            } else {
                                instantaIdToUrmatoareaStatieMap.put(instanta.getIdInstanta(), "Destinație atinsă");
                            }
                            break;
                        }
                    }
                }

                if (targetGps == null) {
                    targetGps = new StatusGPSLive();
                    targetGps.setInstantaCalatorie(instanta);
                }

                targetGps.setLatitudine(BigDecimal.valueOf(targetLat).setScale(6, RoundingMode.HALF_UP));
                targetGps.setLongitudine(BigDecimal.valueOf(targetLon).setScale(6, RoundingMode.HALF_UP));
                
                gpsRepository.save(targetGps);
                instantaIdToVitezaMap.put(instanta.getIdInstanta(), speed);

            } catch (Exception ex) {
                System.err.println("Eroare la simularea GPS pentru instanta " + instanta.getIdInstanta() + ": " + ex.getMessage());
            }
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double earthRadius = 6371; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }
}
