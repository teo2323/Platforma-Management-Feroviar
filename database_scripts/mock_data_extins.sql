INSERT INTO Statii (id, nume_statie) VALUES
(101, 'Constanta'),
(102, 'Fetesti'),
(103, 'Bucuresti Nord'),
(104, 'Ploiesti Vest'),
(105, 'Sinaia'),
(106, 'Predeal'),
(107, 'Brasov'),
(108, 'Fagaras'),
(109, 'Sibiu'),
(110, 'Deva'),
(111, 'Arad'),
(112, 'Timisoara'),
(113, 'Rosiori Nord'),
(114, 'Craiova'),
(115, 'Drobeta-Turnu Severin'),
(116, 'Caransebes'),
(117, 'Cluj-Napoca'),
(118, 'Oradea'),
(119, 'Satu Mare');

INSERT INTO Trenuri (id_tren, tip_tren, capacitate_totala) VALUES
('IR-M1-V1', 'InterRegio', 300),
('IR-M1-V2', 'InterRegio', 250),
('IR-M2-V1', 'InterRegio', 280),
('IR-M2-V2', 'InterRegio', 350);

INSERT INTO Vagoane_Tren (tren_id, numar_vagon, clasa, numar_locuri, facilitati) VALUES
('IR-M1-V1', 1, 2, 100, ARRAY['AC', 'Biciclete']),
('IR-M1-V1', 2, 1, 100, ARRAY['AC', 'Prize', 'Bar']),
('IR-M1-V1', 3, 2, 100, ARRAY['AC']),
('IR-M1-V2', 1, 2, 125, ARRAY['AC']),
('IR-M1-V2', 2, 1, 125, ARRAY['AC', 'Prize']),
('IR-M2-V1', 1, 2, 140, ARRAY['AC', 'Biciclete']),
('IR-M2-V1', 2, 1, 140, ARRAY['AC']),
('IR-M2-V2', 1, 2, 175, ARRAY['AC']),
('IR-M2-V2', 2, 1, 175, ARRAY['AC', 'Prize', 'Restaurant']);

INSERT INTO Rute_Programate (id_ruta, tren_id, statie_plecare_id, statie_destinatie_id, ora_plecare_programata, ora_sosire_programata) VALUES
(10, 'IR-M1-V1', 101, 112, '06:00:00', '18:30:00'),
(20, 'IR-M1-V2', 101, 112, '07:30:00', '17:45:00'),
(30, 'IR-M2-V1', 119, 103, '05:00:00', '19:00:00'),
(40, 'IR-M2-V2', 119, 103, '08:00:00', '21:30:00');

INSERT INTO Opriri_Traseu (id, ruta_id, statie_id, ora_sosire, ora_plecare, ordine_statie) VALUES
(1001, 10, 101, '06:00:00', '06:00:00', 1),
(1002, 10, 103, '08:15:00', '08:30:00', 2),
(1003, 10, 107, '11:00:00', '11:15:00', 3),
(1004, 10, 109, '13:30:00', '13:40:00', 4),
(1005, 10, 110, '15:20:00', '15:25:00', 5),
(1006, 10, 111, '17:10:00', '17:15:00', 6),
(1007, 10, 112, '18:30:00', '18:30:00', 7),
(2001, 20, 101, '07:30:00', '07:30:00', 1),
(2002, 20, 103, '09:45:00', '10:00:00', 2),
(2003, 20, 114, '13:00:00', '13:15:00', 3),
(2004, 20, 115, '15:00:00', '15:10:00', 4),
(2005, 20, 116, '16:30:00', '16:35:00', 5),
(2006, 20, 112, '17:45:00', '17:45:00', 6),
(3001, 30, 119, '05:00:00', '05:00:00', 1),
(3002, 30, 117, '08:00:00', '08:15:00', 2),
(3003, 30, 107, '15:00:00', '15:20:00', 3),
(3004, 30, 104, '17:50:00', '17:55:00', 4),
(3005, 30, 103, '19:00:00', '19:00:00', 5),
(4001, 40, 119, '08:00:00', '08:00:00', 1),
(4002, 40, 118, '09:30:00', '09:40:00', 2),
(4003, 40, 111, '11:40:00', '11:50:00', 3),
(4004, 40, 112, '12:45:00', '13:00:00', 4),
(4005, 40, 114, '18:00:00', '18:15:00', 5),
(4006, 40, 103, '21:30:00', '21:30:00', 6);

INSERT INTO Instante_Calatorie (id_instanta, ruta_id, data_calatoriei, stare, intarziere_minute, locuri_disponibile_actual) VALUES
(10001, 10, '2025-12-10', 'FINALIZAT', 65, 0),
(10002, 10, '2025-12-15', 'FINALIZAT', 80, 0),
(10003, 10, '2025-12-22', 'FINALIZAT', 115, 0),
(10004, 10, '2026-01-05', 'FINALIZAT', 50, 0),
(10005, 10, '2026-01-18', 'FINALIZAT', 120, 0),
(10006, 10, '2026-02-02', 'FINALIZAT', 45, 0),
(10007, 10, '2026-02-14', 'FINALIZAT', 95, 0),
(10008, 10, '2025-07-10', 'FINALIZAT', 5, 0),
(10009, 10, '2025-08-15', 'FINALIZAT', 10, 0),
(20001, 20, '2025-07-05', 'FINALIZAT', 25, 0),
(20002, 20, '2025-07-18', 'FINALIZAT', 35, 0),
(20003, 20, '2025-07-29', 'FINALIZAT', 40, 0),
(20004, 20, '2025-08-03', 'FINALIZAT', 20, 0),
(20005, 20, '2025-08-12', 'FINALIZAT', 30, 0),
(20006, 20, '2025-08-25', 'FINALIZAT', 15, 0),
(20007, 20, '2025-12-15', 'FINALIZAT', 5, 0),
(20008, 20, '2026-01-18', 'FINALIZAT', 10, 0),
(30001, 30, '2025-12-12', 'FINALIZAT', 70, 0),
(30002, 30, '2026-01-20', 'FINALIZAT', 90, 0),
(30003, 30, '2026-02-10', 'FINALIZAT', 55, 0),
(30004, 30, '2025-06-15', 'FINALIZAT', 5, 0),
(40001, 40, '2025-07-10', 'FINALIZAT', 30, 0),
(40002, 40, '2025-08-05', 'FINALIZAT', 35, 0),
(40003, 40, '2026-01-10', 'FINALIZAT', 15, 0),
(50001, 10, '2026-05-04', 'IN_CURS', 10, 45),
(50002, 20, '2026-05-04', 'IN_CURS', 0, 112),
(50003, 30, '2026-05-04', 'IN_CURS', 5, 20),
(60001, 10, '2026-05-05', 'PROGRAMAT', 0, 150),
(60002, 20, '2026-05-05', 'PROGRAMAT', 0, 200),
(60003, 30, '2026-05-06', 'PROGRAMAT', 0, 250),
(60004, 40, '2026-05-06', 'PROGRAMAT', 0, 310);

INSERT INTO Status_GPS_Live (instanta_id, latitudine, longitudine, ultima_actualizare) VALUES
(50001, 45.650000, 25.616000, CURRENT_TIMESTAMP),
(50002, 44.333000, 23.800000, CURRENT_TIMESTAMP),
(50003, 46.783000, 23.583000, CURRENT_TIMESTAMP);

INSERT INTO Alerte_Live (instanta_id, oprire_afectata_id, tip_incident, stare_alerta) VALUES
(10001, 1003, 'NINSOARE_ABUNDENTA', 'REZOLVATA'),
(10003, 1003, 'NINSOARE_ABUNDENTA', 'REZOLVATA'),
(10005, 1003, 'COPAC_CAZUT', 'REZOLVATA'),
(10007, 1003, 'NINSOARE_ABUNDENTA', 'REZOLVATA'),
(20001, 2003, 'CANICULA_SINE_DILATATE', 'REZOLVATA'),
(20003, 2003, 'CANICULA_SINE_DILATATE', 'REZOLVATA'),
(20005, 2003, 'CANICULA_SINE_DILATATE', 'REZOLVATA'),
(30001, 3003, 'NINSOARE_ABUNDENTA', 'REZOLVATA'),
(30002, 3003, 'COPAC_CAZUT', 'REZOLVATA'),
(40001, 4005, 'CANICULA_SINE_DILATATE', 'REZOLVATA');

INSERT INTO Statii (id, nume_statie) VALUES
(120, 'Iasi'),
(121, 'Pascani'),
(122, 'Suceava'),
(123, 'Bacau'),
(124, 'Focsani'),
(125, 'Buzau'),
(126, 'Galati'),
(127, 'Braila'),
(128, 'Baia Mare'),
(129, 'Dej Calatori');

INSERT INTO Trenuri (id_tren, tip_tren, capacitate_totala) VALUES
('IR-M5-V1', 'InterRegio', 400),
('R-M5-LOCAL', 'Regio', 150),
('IR-M4-V1', 'InterRegio', 250),
('R-M4-LOCAL', 'Regio', 120);

INSERT INTO Vagoane_Tren (tren_id, numar_vagon, clasa, numar_locuri, facilitati) VALUES
('IR-M5-V1', 1, 2, 100, ARRAY['AC', 'Biciclete']),
('IR-M5-V1', 2, 2, 100, ARRAY['AC']),
('IR-M5-V1', 3, 1, 100, ARRAY['AC', 'Prize', 'Bar']),
('IR-M5-V1', 4, 2, 100, ARRAY['AC']),
('R-M5-LOCAL', 1, 2, 75, ARRAY['']),
('R-M5-LOCAL', 2, 2, 75, ARRAY['']),
('IR-M4-V1', 1, 2, 125, ARRAY['AC']),
('IR-M4-V1', 2, 1, 125, ARRAY['AC', 'Prize']),
('R-M4-LOCAL', 1, 2, 120, ARRAY['']);

INSERT INTO Rute_Programate (id_ruta, tren_id, statie_plecare_id, statie_destinatie_id, ora_plecare_programata, ora_sosire_programata) VALUES
(50, 'IR-M5-V1', 122, 103, '06:00:00', '13:00:00'),
(60, 'R-M5-LOCAL', 120, 121, '14:00:00', '15:15:00'),
(70, 'IR-M4-V1', 128, 117, '08:30:00', '12:00:00'),
(80, 'R-M4-LOCAL', 126, 125, '10:00:00', '12:00:00');

INSERT INTO Opriri_Traseu (id, ruta_id, statie_id, ora_sosire, ora_plecare, ordine_statie) VALUES
(5001, 50, 122, '06:00:00', '06:00:00', 1),
(5002, 50, 121, '06:45:00', '06:50:00', 2),
(5003, 50, 123, '07:50:00', '07:55:00', 3),
(5004, 50, 124, '09:10:00', '09:15:00', 4),
(5005, 50, 125, '10:30:00', '10:35:00', 5),
(5006, 50, 104, '11:50:00', '11:55:00', 6),
(5007, 50, 103, '13:00:00', '13:00:00', 7),
(6001, 60, 120, '14:00:00', '14:00:00', 1),
(6002, 60, 121, '15:15:00', '15:15:00', 2),
(7001, 70, 128, '08:30:00', '08:30:00', 1),
(7002, 70, 129, '10:00:00', '10:10:00', 2),
(7003, 70, 117, '12:00:00', '12:00:00', 3),
(8001, 80, 126, '10:00:00', '10:00:00', 1),
(8002, 80, 127, '10:30:00', '10:35:00', 2),
(8003, 80, 125, '12:00:00', '12:00:00', 3);

INSERT INTO Instante_Calatorie (id_instanta, ruta_id, data_calatoriei, stare, intarziere_minute, locuri_disponibile_actual) VALUES
(70001, 50, '2023-04-10', 'FINALIZAT', 15, 0),
(70002, 50, '2023-08-22', 'FINALIZAT', 80, 0),
(70003, 50, '2023-11-05', 'FINALIZAT', 45, 0),
(70004, 50, '2024-01-15', 'FINALIZAT', 110, 0),
(70005, 50, '2024-05-18', 'FINALIZAT', 5, 0),
(70006, 50, '2024-09-30', 'FINALIZAT', 65, 0),
(70007, 50, '2025-02-14', 'FINALIZAT', 150, 0),
(70008, 50, '2025-07-20', 'FINALIZAT', 40, 0),
(70009, 50, '2025-10-10', 'FINALIZAT', 10, 0),
(70010, 50, '2026-01-08', 'FINALIZAT', 125, 0),
(70011, 50, '2026-03-12', 'FINALIZAT', 25, 0),
(80001, 60, '2023-05-02', 'FINALIZAT', 15, 0),
(80002, 60, '2023-09-14', 'FINALIZAT', 20, 0),
(80003, 60, '2024-03-25', 'FINALIZAT', 45, 0),
(80004, 60, '2024-08-11', 'FINALIZAT', 10, 0),
(80005, 60, '2025-01-05', 'FINALIZAT', 35, 0),
(80006, 60, '2025-06-19', 'FINALIZAT', 25, 0),
(80007, 60, '2025-11-28', 'FINALIZAT', 50, 0),
(80008, 60, '2026-02-22', 'FINALIZAT', 30, 0),
(80009, 60, '2026-04-15', 'FINALIZAT', 15, 0),
(90001, 70, '2023-06-10', 'FINALIZAT', 55, 0),
(90002, 70, '2023-12-20', 'FINALIZAT', 140, 0),
(90003, 70, '2024-04-18', 'FINALIZAT', 25, 0),
(90004, 70, '2024-10-05', 'FINALIZAT', 85, 0),
(90005, 70, '2025-03-12', 'FINALIZAT', 45, 0),
(90006, 70, '2025-08-30', 'FINALIZAT', 20, 0),
(90007, 70, '2026-01-14', 'FINALIZAT', 115, 0),
(90008, 70, '2026-04-02', 'FINALIZAT', 35, 0),
(100001, 80, '2023-07-15', 'FINALIZAT', 25, 0),
(100002, 80, '2024-02-28', 'FINALIZAT', 60, 0),
(100003, 80, '2024-11-10', 'FINALIZAT', 40, 0),
(100004, 80, '2025-05-25', 'FINALIZAT', 15, 0),
(100005, 80, '2025-09-18', 'FINALIZAT', 30, 0),
(100006, 80, '2026-03-05', 'FINALIZAT', 55, 0),
(110001, 50, '2026-05-04', 'IN_CURS', 90, 115),
(110002, 70, '2026-05-04', 'IN_CURS', 45, 60),
(120001, 50, '2026-05-05', 'PROGRAMAT', 0, 310),
(120002, 60, '2026-05-05', 'PROGRAMAT', 0, 105),
(120003, 70, '2026-05-06', 'PROGRAMAT', 0, 200),
(120004, 80, '2026-05-06', 'PROGRAMAT', 0, 85);

INSERT INTO Status_GPS_Live (instanta_id, latitudine, longitudine, ultima_actualizare) VALUES
(110001, 45.698000, 27.185000, CURRENT_TIMESTAMP),
(110002, 47.142000, 23.882000, CURRENT_TIMESTAMP);

INSERT INTO Alerte_Live (instanta_id, oprire_afectata_id, tip_incident, stare_alerta) VALUES
(70002, 5003, 'LUCRARI_INFRASTRUCTURA', 'REZOLVATA'),
(70004, 5004, 'DEFECTIUNE_LOCOMOTIVA', 'REZOLVATA'),
(70006, 5005, 'RESTRICTIE_VITEZA', 'REZOLVATA'),
(70007, 5002, 'NINSOARE_ABUNDENTA', 'REZOLVATA'),
(70010, 5003, 'DEFECTIUNE_LOCOMOTIVA', 'REZOLVATA'),
(80003, 6002, 'RESTRICTIE_VITEZA', 'REZOLVATA'),
(80007, 6002, 'LUCRARI_INFRASTRUCTURA', 'REZOLVATA'),
(90002, 7002, 'NINSOARE_ABUNDENTA', 'REZOLVATA'),
(90004, 7002, 'LUCRARI_INFRASTRUCTURA', 'REZOLVATA'),
(90007, 7002, 'DEFECTIUNE_LOCOMOTIVA', 'REZOLVATA'),
(100002, 8002, 'RESTRICTIE_VITEZA', 'REZOLVATA'),
(100006, 8002, 'DEFECTIUNE_LOCOMOTIVA', 'REZOLVATA'),
(110001, 5004, 'DEFECTIUNE_LOCOMOTIVA', 'ACTIVA'),
(110002, 7002, 'LUCRARI_INFRASTRUCTURA', 'ACTIVA');