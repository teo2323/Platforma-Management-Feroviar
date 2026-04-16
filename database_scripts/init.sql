CREATE TABLE Statii (
    id SERIAL PRIMARY KEY,
    nume_statie VARCHAR(255) NOT NULL
);

CREATE TABLE Trenuri (
    id_tren VARCHAR(50) PRIMARY KEY,
    tip_tren VARCHAR(50) NOT NULL,
    capacitate_totala INT NOT NULL
);

CREATE TABLE Vagoane_Tren (
    id_vagon SERIAL PRIMARY KEY,
    tren_id VARCHAR(50) REFERENCES Trenuri(id_tren),
    numar_vagon INT NOT NULL,
    clasa INT NOT NULL,
    numar_locuri INT NOT NULL,
    facilitati TEXT[]
);

CREATE TABLE Rute_Programate (
    id_ruta SERIAL PRIMARY KEY,
    tren_id VARCHAR(50) REFERENCES Trenuri(id_tren),
    statie_plecare_id INT REFERENCES Statii(id),
    statie_destinatie_id INT REFERENCES Statii(id),
    ora_plecare_programata TIME NOT NULL,
    ora_sosire_programata TIME NOT NULL
);

CREATE TABLE Opriri_Traseu (
    id SERIAL PRIMARY KEY,
    ruta_id INT REFERENCES Rute_Programate(id_ruta),
    statie_id INT REFERENCES Statii(id),
    ora_sosire TIME NOT NULL,
    ora_plecare TIME NOT NULL,
    ordine_statie INT NOT NULL
);

CREATE TABLE Instante_Calatorie (
    id_instanta SERIAL PRIMARY KEY,
    ruta_id INT REFERENCES Rute_Programate(id_ruta),
    data_calatoriei DATE NOT NULL,
    stare VARCHAR(50) CHECK (stare IN ('PROGRAMAT', 'IN_CURS', 'FINALIZAT')),
    intarziere_minute INT DEFAULT 0,
    locuri_disponibile_actual INT
);

CREATE TABLE Status_GPS_Live (
    id SERIAL PRIMARY KEY,
    instanta_id INT REFERENCES Instante_Calatorie(id_instanta),
    latitudine DECIMAL(9, 6) NOT NULL,
    longitudine DECIMAL(9, 6) NOT NULL,
    ultima_actualizare TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Alerte_Live (
    id_alerta SERIAL PRIMARY KEY,
    instanta_id INT REFERENCES Instante_Calatorie(id_instanta),
    oprire_afectata_id INT REFERENCES Opriri_Traseu(id),
    tip_incident VARCHAR(100) NOT NULL,
    stare_alerta VARCHAR(50) CHECK (stare_alerta IN ('ACTIVA', 'REZOLVATA'))
);


INSERT INTO Statii (id, nume_statie) VALUES
(1, 'Bucuresti Nord'),
(2, 'Ploiesti Vest'),
(3, 'Sinaia'),
(4, 'Predeal'),
(5, 'Brasov');

INSERT INTO Trenuri (id_tren, tip_tren, capacitate_totala) VALUES
('IR-1633', 'InterRegio', 200);

INSERT INTO Vagoane_Tren (tren_id, numar_vagon, clasa, numar_locuri, facilitati) VALUES
('IR-1633', 1, 2, 100, ARRAY['AC', 'Biciclete']),
('IR-1633', 2, 1, 100, ARRAY['AC', 'Bar', 'Prize']);

INSERT INTO Rute_Programate (id_ruta, tren_id, statie_plecare_id, statie_destinatie_id, ora_plecare_programata, ora_sosire_programata) VALUES
(1, 'IR-1633', 1, 5, '08:00:00', '10:30:00');

INSERT INTO Opriri_Traseu (id, ruta_id, statie_id, ora_sosire, ora_plecare, ordine_statie) VALUES
(1, 1, 1, '08:00:00', '08:00:00', 1),
(2, 1, 2, '08:40:00', '08:42:00', 2),
(3, 1, 3, '09:30:00', '09:32:00', 3),
(4, 1, 4, '09:50:00', '09:52:00', 4),
(5, 1, 5, '10:30:00', '10:30:00', 5);

INSERT INTO Instante_Calatorie (id_instanta, ruta_id, data_calatoriei, stare, intarziere_minute, locuri_disponibile_actual) VALUES
(1, 1, '2026-04-11', 'FINALIZAT', 5, 0),
(2, 1, '2026-04-12', 'FINALIZAT', 0, 0),
(3, 1, '2026-04-13', 'FINALIZAT', 12, 0),
(4, 1, '2026-04-14', 'FINALIZAT', 45, 0),
(5, 1, '2026-04-15', 'FINALIZAT', 2, 0),
(6, 1, '2026-04-16', 'IN_CURS', 55, 45);

INSERT INTO Status_GPS_Live (instanta_id, latitudine, longitudine, ultima_actualizare) VALUES
(6, 45.453210, 25.543210, CURRENT_TIMESTAMP);

INSERT INTO Alerte_Live (instanta_id, oprire_afectata_id, tip_incident, stare_alerta) VALUES
(6, 4, 'COPAC_CAZUT', 'ACTIVA');