# TODO – TIA Hotkey Launcher

## 1. Hook globale tastiera (funzionare anche con TIA in primo piano)

- [ ] Scegliere la libreria per il global hook:
  - Opzione consigliata: `uiohook-napi` (hook globale, supporta tasti singoli) [web:325].
- [ ] Installare la dipendenza:
  - `npm install uiohook-napi`
- [ ] Spostare il listener dei tasti da `index.html` al `main.js`:
  - Nel `main.js`, usare `uIOhook.on('keydown', ...)` per catturare `c`, `d`, `o`, `f`, `ArrowUp`, `ArrowDown`, `w`.
  - Mappare il `keycode` di `uIOhook` ai nomi logici delle azioni (`open`, `closed`, `coil`, `func`, `up`, `down`, `w`).
- [ ] Integrare con l’add-on C++:
  - Per i tasti “semplici” (c, d, o, f, frecce): chiamare direttamente `keyaddon.sendCombo([...])` dal `main.js`.
  - Per `w`: implementare la macro nel `main.js` usando la sequenza:
    - `open` → `left` → `down` → `open` → `up` → `right`.
- [ ] Collegare il toggle (abilita/disabilita):
  - Dal renderer (`index.html`), comunicare al main quando abilitare/disabilitare l’hook globale (via IPC o, per ora, modificando una variabile esposta con `contextBridge`).
  - Quando il listener è disabilitato, non eseguire alcuna azione in risposta ai tasti globali.

## 2. Resize / layout più compatto

- [ ] Ridurre dimensioni finestra di default in `main.js`:
  - Da `1020x660` a qualcosa tipo `900x550` o `840x520`.
- [ ] Rendere il layout più denso:
  - Diminuire padding nei `.card` da `2.2rem` a ~`1.6rem`.
  - Ridurre gap della `.shell` da `2rem` a `1.4rem`.
  - Ridurre un po’ il font delle descrizioni (subtitle, sidebar) per farci stare tutto meglio.
- [ ] Testare il layout a minima larghezza:
  - Verificare che a `minWidth` la tabella non scrolli orizzontalmente.
  - Se serve, rendere alcune colonne più strette o usare testo abbreviato.

## 3. Stile della scrollbar

- [ ] Aggiungere uno stile coerente per la scrollbar, in modo che non rimanga bianca/grigia di default.
- [ ] In `style.css`, aggiungere regole per le scrollbar (Chrome/Edge/WebKit):

  ```css
  body {
    scrollbar-color: #4b5563 #020617; /* Firefox */
    scrollbar-width: thin;
  }

  /* Chrome / Edge / Safari */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #020617;
  }

  ::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  ```

- [ ] Verificare il contrasto in dark mode:
  - Track scuro (`#020617`), thumb grigio (`#4b5563`) per non avere una barra bianca che stacca troppo sullo sfondo scuro.

## 4. Pulizia finale

- [ ] Rimuovere eventuali variabili e funzioni non più usate nel renderer dopo aver spostato il listener in `main.js`.
- [ ] Aggiornare i testi nella UI per riflettere il fatto che i tasti funzionano anche con TIA in primo piano.
- [ ] (Opzionale) Salvare le impostazioni (tasti locali, toggle key) su un JSON locale per mantenerle tra un riavvio e l’altro.
