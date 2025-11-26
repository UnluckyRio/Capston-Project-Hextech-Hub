# HexTech Hub — Panoramica e Guida

HexTech Hub è una web app full‑stack dedicata alla community di League of Legends. Include un frontend React (Vite) e un backend Spring Boot con autenticazione JWT. L'app è responsive (mobile‑first), supporta la pubblicazione di articoli da parte degli utenti autenticati e visualizza contenuti pubblici come liste e dettagli.

## Architettura

- **Frontend**: React 19 + Vite, React Router, Bootstrap/SCSS.
  - Routing SPA con `HashRouter` per compatibilità GitHub Pages.
  - Base degli asset configurata per project site.
  - Contesto di autenticazione JWT per gestione login/logout e protezione rotte.
- **Backend**: Spring Boot, JPA, Security, JWT.
  - Filtri di autenticazione JWT per proteggere endpoint.
  - Endpoint di autenticazione.
  - Endpoint articoli pubblici e protetti.

## Funzionalità Principali

- **Autenticazione**: login/signup con JWT; il token è memorizzato (localStorage) per sessioni persistenti.
- **Articoli**:
  - Lista pubblica con filtro e ordinamento.
  - Creazione articoli riservata agli utenti autenticati (form visibile solo se loggati).
  - Mappatura dei dati per UI coerente.
- **UI Responsive**: layout mobile‑first con media queries e griglie adattive.
- **Deploy**: supporto a GitHub Pages (project site).

## Funzionalità del Sito

- **Navigazione**: menu laterale per accedere a Home, Profile, Tier List, Champions, Article.
- **Profilo**: ricerca evocatori e visualizzazione statistiche/partite recenti.
- **Tier List**: tabella interattiva con ordinamento per pick/win/ban rate e ricerca.
- **Champions**: elenco e dettaglio campioni con abilità, rune e skin.
- **Articoli**: lettura articoli pubblici; se autenticato puoi pubblicare nuovi contenuti.

## Licenza

Progetto a scopo didattico/dimostrativo. Tutti i marchi citati appartengono ai rispettivi proprietari.
