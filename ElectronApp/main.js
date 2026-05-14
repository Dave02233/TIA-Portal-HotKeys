const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

const keysAddon = require(path.join(__dirname, 'build', 'Release', 'keyaddon.node'));

let win = null;
let enabled = false;
let currentLocalMap = {};
let currentTIABindings = {};
let currentMacros = {};
let currentToggleKey = 'CapsLock';
let previousToggleKey = null;
const registeredActionKeys = new Set();

function toAccelerator(key) {
  if (!key) return '';
  if (key.startsWith('Arrow')) return key.slice(5).replace(/^[a-z]/, s => s.toUpperCase());
  if (key.length === 1) return key.toUpperCase();
  return key;
}

async function sendSequence(actions, delayMs = 120) {
  for (const action of actions) {
    const binding = currentTIABindings[action];
    if (Array.isArray(binding) && binding.length > 0) {
      try { keysAddon.sendCombo(binding, 80); } catch (e) {}
    }
    await new Promise(r => setTimeout(r, delayMs));
  }
}

function registerActionShortcuts() {
  unregisterActionShortcuts();
  for (const [localKey, action] of Object.entries(currentLocalMap || {})) {
    const acc = toAccelerator(localKey);
    if (!acc) continue;
    if (globalShortcut.isRegistered(acc)) continue;
    const cb = () => {
      const macro = currentMacros && currentMacros[action];
      if (macro && Array.isArray(macro.sequence)) {
        sendSequence(macro.sequence);
        return;
      }
      const binding = currentTIABindings[action];
      if (Array.isArray(binding) && binding.length > 0) {
        try { keysAddon.sendCombo(binding, 80); } catch (e) {}
      }
    };
    try {
      const ok = globalShortcut.register(acc, cb);
      if (ok) registeredActionKeys.add(acc);
    } catch (e) {}
  }
}

function unregisterActionShortcuts() {
  for (const acc of Array.from(registeredActionKeys)) {
    try { globalShortcut.unregister(acc); } catch (e) {}
    registeredActionKeys.delete(acc);
  }
}

function registerToggleKey() {
  try {
    if (previousToggleKey && previousToggleKey !== currentToggleKey) {
      globalShortcut.unregister(previousToggleKey);
    }
  } catch (e) {}

  try { globalShortcut.unregister(currentToggleKey); } catch (e) {}
  try {
    const ok = globalShortcut.register(currentToggleKey, () => {
      enabled = !enabled;
      if (enabled) registerActionShortcuts(); else unregisterActionShortcuts();
      if (win && win.webContents) win.webContents.send('enabled-changed', enabled);
    });
    if (ok) previousToggleKey = currentToggleKey;
  } catch (e) {}
}

function createWindow() {
  win = new BrowserWindow({
    width: 1020,
    height: 660,
    minWidth: 760,
    minHeight: 540,
    backgroundColor: '#020617',
    title: 'TIA Hotkey Launcher',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  win.setMenuBarVisibility(false);

  win.on('closed', () => { win = null; });
}

app.whenReady().then(createWindow);

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('update-shortcuts', (event, payload) => {
  currentLocalMap = payload.localMap || {};
  currentTIABindings = payload.tiaBindings || {};
  currentMacros = payload.macros || {};
  currentToggleKey = payload.toggleKey || 'CapsLock';
  registerToggleKey();
  if (payload.enabled) {
    enabled = true;
    registerActionShortcuts();
  } else {
    enabled = false;
    unregisterActionShortcuts();
  }
  if (win && win.webContents) win.webContents.send('enabled-changed', enabled);
});

ipcMain.on('toggle-request', () => {
  enabled = !enabled;
  if (enabled) registerActionShortcuts(); else unregisterActionShortcuts();
  if (win && win.webContents) win.webContents.send('enabled-changed', enabled);
});