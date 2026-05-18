# TIA-Portal-HotKeys
TIA Portal HotKeys

**Build e distribuzione (Windows)**

Prerequisiti:

- Node.js (consigliata 16+)
- npm
- Windows (per il packaging .exe)

Passaggi per costruire l'app per Windows:

1. Installa le dipendenze:

```bash
npm install
```

2. Esegui lo script di build per Windows (comando consigliato):

```bash
npm run win
```

Nota: se `npm run win` non è definito in `package.json`, aggiungi uno script simile sotto la sezione `scripts` di `package.json`:

```json
"scripts": {
	"win": "electron-builder --win"
}
```

