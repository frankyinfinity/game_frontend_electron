# gioco - Electron Client

Questo è il client desktop per il gioco "Il Cervellone", basato su Electron.

## Prerequisiti

- Node.js e NPM installati.
- Il backend Laravel deve essere in esecuzione su `http://localhost:8000`.

## Installazione

Entra nella cartella `frontend` e installa le dipendenze:

```bash
cd frontend
npm install
```

## Avvio

Per avviare il client:

```bash
npm start
```

## Funzionalità Implementate

1. **Login Moderno**: Pagina di login con estetica premium (glassmorphism) che permette l'accesso solo ai player.
2. **Game Client**: Replica fedele della logica di visualizzazione mappa di `players.show` utilizzando PixiJS e aggiornamenti real-time via Pusher.
3. **Integrazione Backend**: Aggiunti endpoint API nel backend Laravel per gestire l'autenticazione e il recupero dei dati della mappa per il client Electron.

## Note Tecniche

- Il client comunica con il backend tramite API REST (`/api/auth/login`, `/api/players/generate-map`, etc.).
- Gli eventi di gioco sono gestiti tramite Pusher.
- Le interazioni (click sulle tile, movimento entità) sono gestite tramite WebSocket diretti ai container delle entità, replicando il comportamento del frontend web.
