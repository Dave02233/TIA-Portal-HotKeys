const { app, BrowserWindow } = require('electron');
const path = require('path');
const keys = require('./build/Release/keyaddon.node');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadURL('https://example.com'); // o un file locale

  setTimeout(() => {
    keys.sendCombo(['alt', 'f1'], 200);
  }, 3000);
}

app.whenReady().then(createWindow);