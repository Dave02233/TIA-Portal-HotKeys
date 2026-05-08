const { app, BrowserWindow } = require('electron');
const path = require('path');
const keys = require('./build/Release/keyaddon.node');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    backgroundColor: '#020617',
    webPreferences: {
      nodeIntegration: true,      // per usare require nel renderer
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});