# SpaceSite - Frontend

Statischer HTML/CSS-Prototyp (Meilenstein 2) für das Praktikum *Web-Anwendungen* (WS 2026/2027).

## Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 16 oder neuer)

## Installation

Einmalig die Abhängigkeiten im Verzeichnis `frontend` installieren:

```bash
cd frontend
npm install
```

## Server starten

Den Express-Webserver starten:

```bash
npm start
```
*(Alternativ: `node server.js`)*

Der Server läuft standardmäßig auf Port 3000: `http://localhost:3000`

## Verfügbare Seiten

Nach dem Starten des Servers können folgende Ansichten im Browser aufgerufen werden:

- **Login & Registrierung**: `http://localhost:3000/login-register.html`
- **Buch-Einzelansicht (Eingeloggt)**: `http://localhost:3000/book-detail.html`
- **Buch-Einzelansicht (In Leseliste)**: `http://localhost:3000/book-detail-added.html`
- **Buch-Einzelansicht (Gast)**: `http://localhost:3000/book-detail-guest.html`
- **Landing Page (Katalog)**: `http://localhost:3000/index.html`
- **Leseliste**: `http://localhost:3000/reading-list.html`
- **Impressum**: `http://localhost:3000/impressum.html`
