# SmartRail — Platformă Inteligentă de Management Feroviar

SmartRail este o platformă modernă destinată monitorizării, simulării și analizei inteligente a traficului feroviar. Sistemul integrează algoritmi de simulare geografică în timp real, gestionare dinamică a incidentelor (calamități) și asistență decizională bazată pe modele de limbaj de mari dimensiuni (LLM).

Proiectul este gândit ca o structură modulară, oferind pasagerilor și dispecerilor informații precise despre starea rețelei feroviare, întârzieri istorice și recomandări personalizate generate prin corelarea datelor meteorologice cu istoricul curselor.

---

## 1. Arhitectura Sistemului

Aplicația este construită pe baza unei arhitecturi client-server clasice, consolidată cu un motor de procesare a limbajului natural (LLM) configurabil:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                          │
│   ┌───────────────────────────┬────────────────────────────────────┐   │
│   │  Căutare Rute & Recomandări│ Hartă Interactivă (Leaflet)        │   │
│   └─────────────┬─────────────┴─────────────────┬──────────────────┘   │
└─────────────────┼───────────────────────────────┼──────────────────────┘
                  │ API Requests                  │ API Requests
                  ▼                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Spring Boot API)                       │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Controllers (Rute, Trenuri, Calamități, Hartă)                 │   │
│   ├────────────────────────────────────────────────────────────────┤   │
│   │ Services (GPS Simulation, Calamități, AiService)               │   │
│   └──────────────────────┬──────────────────────┬──────────────────┘   │
└──────────────────────────┼──────────────────────┼──────────────────────┘
                           │ JDBC / JPA           │ HTTP Client
                           ▼                      ▼
┌──────────────────────────────┐        ┌────────────────────────────────┐
│     DATABASE (PostgreSQL)    │        │       AI AGENTS (LLM)          │
│                              │        │  - Google Gemini API           │
│  Tabele: Trenuri, Vagoane,   │        │  - Ollama Local (Llama 3.2)    │
│  Statii, Rute, Instante, GPS │        │  (Mecanism Fallback Inclus)    │
└──────────────────────────────┘        └────────────────────────────────┘
```

### Componente și Tehnologii:
1. **Frontend (Interfața Utilizator)**:
   - Construit în **React** cu **Vite** ca instrument de build rapid.
   - Design implementat cu **Tailwind CSS** (design minimalist, dark mode, accente moderne galbene/neutre, tranzinții fluide).
   - Hartă interactivă construită cu **React-Leaflet** și **Leaflet.js** pentru randarea geografică a stațiilor, trenurilor active și calamităților.
   - Set de iconițe vectoriale furnizat de **Lucide React**.

2. **Backend (Logica de Business & API)**:
   - Dezvoltat în **Java 17** folosind framework-ul **Spring Boot**.
   - Gestiunea dependențelor și build-ul sunt realizate prin **Maven**.
   - Integrare **Spring Data JPA** pentru comunicarea cu baza de date relațională.
   - Schedulere active (`@EnableScheduling`) destinate actualizării periodice a simulării de mișcare și a evenimentelor meteo/infrastructură.

3. **Baza de Date**:
   - Sistem de gestiune **PostgreSQL** pentru stocarea persistenței datelor structurate.
   - Schema este definită și menținută curată folosind validarea JPA la pornire (`ddl-auto=validate`).

4. **Motorul AI (LLM)**:
   - Serviciu dedicat (`AiService`) care acționează ca un gateway către LLM-uri.
   - Comunică prin cereri HTTP POST standard (`java.net.http.HttpClient`) trimițând payload-uri JSON structurate.

---

## 2. Fluxul de Lucru & Comunicarea între Componente

Sistemul funcționează reactiv și asincron. O sesiune tipică de utilizare decurge astfel:

1. **Căutarea Rutelor și Generarea Analizei**:
   - Utilizatorul alege stația de *Plecare* și *Destinație* în interfață și apasă *Căutare*.
   - Frontend-ul trimite un request GET către `/api/rute/cauta?plecare=X&destinatie=Y`.
   - Backend-ul rulează o interogare complexă în baza de date pentru a identifica rutele programate valabile și extrage istoricul curselor trecute (`Instante_Calatorie` finalizate) cu întârzierile și alertele lor.
   - Datele istorice sunt structurate sub formă de prompt-uri. Backend-ul apelează asincron serviciul AI pentru a primi o analiză pe fiecare rută, iar apoi un al doilea apel analizează contextul general (inclusiv sezonul curent și calamitățile active pe traseu) pentru a genera o recomandare finală.
   - Frontend-ul primește răspunsul JSON complet și randează cardurile de rezultate împreună cu recomandările AI evidențiate.

2. **Sincronizarea Hărții Live**:
   - Pagina `HartaPage.jsx` montează un timer care apelează la fiecare 10 secunde endpoint-ul `/api/harta/live` și `/api/calamitati`.
   - Backend-ul returnează lista de statusuri GPS active ale trenurilor aflate în tranzit și coordonatele calamităților active în acel moment în rețea.
   - Harta se redesenează dinamic, mutând markerii de trenuri pe coordonatele noi calculate de simulator.

---

## 3. Structura Bazei de Date (PostgreSQL)

Baza de date este organizată în jurul conceptului de planificare feroviară și execuție live a curselor. Schema fizică cuprinde următoarele tabele:

| Tabel | Rol / Descriere |
| :--- | :--- |
| `Statii` | Nomenclatorul stațiilor feroviare (id, nume). |
| `Trenuri` | Flota de garnituri (id unic precum "IR-1633", tipul de tren, capacitate totală). |
| `Vagoane_Tren` | Compoziția fizică a trenurilor (clasa 1/2, număr locuri, facilități sub formă de vector text/array: `AC`, `Wi-Fi`, `Prize`, `Bar`). |
| `Rute_Programate` | Rutele de bază din mersul trenurilor, legând o stație de plecare de una de destinație cu orele de plecare/sosire programate general. |
| `Opriri_Traseu` | Trecerea intermediară a unei rute prin gări (ordine stație, ora sosirii și plecării din fiecare punct). |
| `Instante_Calatorie` | Instanțele fizice ale unei rute rulate într-o zi specifică (are stări: `PROGRAMAT`, `IN_CURS`, `FINALIZAT`, plus minutele de întârziere acumulate). |
| `Status_GPS_Live` | Locația curentă (latitudine, longitudine) raportată pentru instanțele aflate `IN_CURS` pe traseu. |
| `Alerte_Live` | Incidentele apărute pe traseu pentru o anumită călătorie (stare activă sau rezolvată, tip incident - ex. `COPAC_CAZUT`). |

---

## 4. Serviciul AI și Arhitectura Agenților

Platforma folosește inteligența artificială nu doar ca pe un simplu generator de text, ci sub formă de **agenți specializați** care procesează informațiile din baza de date pentru a oferi asistență contextuală.

### 4.1. Provideri LLM și Mecanismul de Fallback (High Availability)
Sistemul suportă două motoare de execuție, configurabile în `application.properties`:
*   **Google Gemini API** (extern, modelul `gemini-2.5-flash`): accesat prin API key, oferă răspunsuri rapide și de înaltă calitate.
*   **Ollama** (local, modelul `llama3.2`): instanță locală rulată de regulă pe portul `11434`.

Pentru a garanta că funcționalitatea AI nu se blochează dacă rețeaua pică sau cheia API expiră, `AiService.java` implementează un **mecanism de fallback bidirecțional**:
1. Dacă providerul principal este setat pe `gemini` și apelul eșuează, serviciul interceptează eroarea, pornește o cerere către instanța locală de `ollama` și returnează răspunsul acesteia.
2. Dacă providerul principal este `ollama` și serviciul local nu răspunde (ex. serviciul Ollama este oprit), se încearcă imediat fallback-ul pe API-ul online `gemini`.
3. În cazul extrem în care ambele sisteme sunt offline sau indisponibile, agentul oferă un răspuns de siguranță predefinit: *"Analiza de risc: Ruta stabila conform istoricului recent."*, menținând astfel experiența utilizatorului stabilă.

### 4.2. Arhitectura Multi-Agent din Spatele Căutării
Când un utilizator caută o rută feroviară, backend-ul declanșează un lanț de procesare format din doi agenți AI diferiți:

*   **Agentul Analist de Rută (Individual)**:
    *   **Scop**: Analizează istoricul exclusiv al unui singur tren pe ruta selectată.
    *   **Context**: Primește valorile statistice calculate din călătoriile trecute (întârzierea minimă, medie și maximă) plus incidentele înregistrate istoric pe acea rută.
    *   **Prompting**: Este instruit să se comporte ca un analist statistic și să returneze o singură propoziție scurtă (maximum 30 de cuvinte) care să sintetizeze tiparul observat (ex: *"Întârzierea pe această rută este de minim 2 min, medie 15 min și maxim 45 min; observăm că întârzierile mari apar de regulă la orele de vârf din cauza aglomerării gării Predeal."*).
    *   **Rezultat**: Recomandarea este atașată direct obiectului de rută în JSON.

*   **Agentul Coordonator de Trafic (Super-Agent General)**:
    *   **Scop**: Corelează imaginea de ansamblu și oferă un verdict final pentru călător.
    *   **Context**: Primește toate rutele găsite ca fiind valide pentru destinație, analizele generate anterior de *Agentul Analist de Rută* pentru fiecare tren, anotimpul curent (corelat cu data curentă) și lista calamităților/alertelor active de pe traseu.
    *   **Prompting**: Analizează dacă vreun tren trece prin zone afectate de intemperii sau dacă statisticile indică probleme sezoniere (ex. întârzieri mari specifice iernii). Rulează o evaluare comparativă și scrie un verdict clar în maximum 85 de cuvinte, recomandând direct cel mai sigur tren în circumstanțele curente.
    *   **Rezultat**: Returnat ca proprietate separată în răspunsul API sub numele de `expertizaGenerala`.

### 4.3. Agentul Chatbot de Flotă (Wagon Assistant)
Pe pagina de compoziție a trenurilor (`WagonWeb.jsx`), utilizatorul poate discuta liber cu un chatbot.
*   **Cum funcționează**: Când utilizatorul trimite o întrebare (ex: *"Care trenuri au vagoane de clasa 1 cu aer condiționat?"*), backend-ul primește întrebarea pe endpoint-ul `/api/trenuri/chat`.
*   **Generare Context**: Serviciul extrage întreaga listă de trenuri active din baza de date, împreună cu detaliile complete ale vagoanelor asociate (clase, capacitate, facilități).
*   **Prompting**: Datele extrase sunt formatate ca text și injectate în prompt împreună cu întrebarea utilizatorului. LLM-ul funcționează ca un agent de suport feroviar informat direct din baza de date (RAG static), răspunzând politicos și strict pe baza datelor reale furnizate, eliminând complet riscul de halucinație.

---

## 5. Simulări și Automatizări în Timp Real

Sistemul nu depinde de date statice; mișcarea trenurilor și generarea alertelor sunt complet simulate prin procese care rulează în fundal pe server:

### 5.1. Simulatorul de Poziții GPS (`GpsSimulationService`)
În backend, o metodă programată rulează automat la fiecare **5 secunde** (`@Scheduled(fixedDelay = 5000)`):

1. **Identificarea Trenurilor în Mișcare**: Serviciul interoghează baza de date pentru a găsi toate instanțele de călătorie active (`stare = 'IN_CURS'`).
2. **Calculul Timpului Logic**:
   - Dacă ora curentă se încadrează în programul trenului (între plecare și sosire), sistemul folosește ora curentă din care scade minutele de întârziere înregistrate pentru acea cursă. Acest lucru simulează faptul că un tren întârziat se află fizic în punctul în care ar fi trebuit să fie cu *X* minute în urmă.
   - Dacă ora curentă este în afara orelor programate (de exemplu, noaptea, când nu sunt curse active în baza de date), simulatorul rulează într-o buclă demonstrativă (looping time) pentru a asigura prezența markerilor pe hartă în scop de prezentare.
3. **Interpolare Geografică**:
   - Simulatorul identifică stația precedentă și stația următoare pe baza ordinii opririlor din traseu.
   - Extrage coordonatele geografice predefinite ale celor două gări.
   - Calculează progresul temporal (raportul dintre timpul scurs de la plecare și durata totală a segmentului).
   - Estimează poziția geografică curentă prin interpolare liniară între coordonatele celor două stații.
   - Calculează viteza trenului în km/h pe baza distanței dintre stații și a timpului alocat segmentului de drum (vitezele sunt simulate între 55 și 120 km/h).
4. **Actualizare în Bază de Date**: Salvează noile coordonate în tabela `Status_GPS_Live`, care vor fi imediat preluate de frontend la următorul polling.

### 5.2. Blocarea Trenurilor în Caz de Calamitate
Sistemul integrează o interacțiune directă între alertele de pe traseu și mișcarea fizică a trenurilor:
*   În timpul fiecărui ciclu de simulare GPS, `GpsSimulationService` verifică dacă stația următoare spre care se îndreaptă trenul (`urmatoareaStatie`) este afectată de o calamitate activă în sistem (ex. ninsori abundente, copac căzut pe linie).
*   Dacă se detectează o astfel de calamitate, **viteza trenului este setată automat la 0 km/h**, iar coordonatele sale geografice sunt înghețate (trenul nu mai înaintează).
*   Pe hartă, trenul va apărea ca staționând pe traseu, iar popup-ul său va raporta viteza 0 km/h și starea de întârziere în creștere, oferind utilizatorilor o simulare realistă a blocajelor din infrastructură.
*   Când călătoria ajunge la destinația finală (în timp real sau simulat), starea instanței de călătorie este marcată automat ca `FINALIZAT` în baza de date și trenul este eliminat din monitorizarea live a hărții.

### 5.3. Serviciul de Calamități (`CalamitateService`)
Pentru a genera dinamism în sistem, serviciul `CalamitateService` simulează fenomene extreme la intervale regulate:
*   La pornirea backend-ului (`@PostConstruct`), se generează un set inițial de calamități pe stații aleatorii.
*   O metodă planificată rulează la fiecare **60 de secunde** (`@Scheduled(fixedDelay = 60000)`), curățând starea anterioară și generând noi incidente.
*   Fiecare stație din baza de date are o probabilitate de **20%** de a fi lovită de o calamitate. Tipurile de calamități sunt alese aleatoriu dintr-o listă predefinită:
    *   `NINSORI_ABUNDENTE` (❄️)
    *   `FURTUNA` (⛈️)
    *   `INUNDATIE` (🌊)
    *   `ALUNECARI_DE_TEREN` (⛰️)
    *   `ZAPADA_PE_LINIE` (⛄)
    *   `TEMPERATURI_EXTREME` (🔥)
    *   `COPACI_CAZUTI` (🌲)
*   Dacă din calculul probabilistic nu rezultă nicio calamitate activă, sistemul alege manual o stație aleatorie și îi atribuie un incident, garantând că pe hartă va exista întotdeauna cel puțin o zonă de avertizare activă pentru demonstrație.
*   Calamitățile pot fi, de asemenea, resetate/regenerate instantaneu printr-un apel manual POST către `/api/calamitati/reset`.

---

## 6. Cum se instalează și se rulează proiectul

### 6.1. Cerințe preliminare
*   **Java Development Kit (JDK) 17** sau mai recent.
*   **Node.js** (versiunea 18+) și **npm**.
*   **PostgreSQL** rulând local.
*   (Opțional) **Ollama** rulând local cu modelul `llama3.2` descărcat (`ollama run llama3.2`).

### 6.2. Configurare Bază de Date
1. Creează o bază de date goală numită `smartrail` în PostgreSQL.
2. Rulează scripturile din directorul `database_scripts` pentru a popula structura și datele inițiale:
   - Mai întâi `init.sql` (creează tabelele și datele de test de bază).
   - (Opțional) `mock_data_extins.sql` pentru seturi de date suplimentare.

### 6.3. Pornire Backend
1. Navighează în folderul `backend`.
2. Configurează setările conexiunii la baza de date și cheia API Gemini în `src/main/resources/application.properties` (modifică URL-ul jdbc, user-ul, parola și `gemini.api.key`).
3. Rulează aplicația Spring Boot:
   ```bash
   ./mvnw spring-boot:run
   ```
   Serverul va porni implicit pe portul `8080`.

### 6.4. Pornire Frontend
1. Navighează în folderul `frontend`.
2. Instalează dependențele necesare:
   ```bash
   npm install
   ```
3. Pornește serverul de dezvoltare Vite:
   ```bash
   npm run dev
   ```
4. Deschide în browser adresa indicată (de regulă `http://localhost:5173`).
