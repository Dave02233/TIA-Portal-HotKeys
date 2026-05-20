const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

const addonPath = app.isPackaged
  ? path.join(process.resourcesPath, 'app.asar.unpacked', 'build', 'Release', 'keyaddon.node')
  : path.join(__dirname, 'build', 'Release', 'keyaddon.node');

let keysAddon;
try {
  keysAddon = require(addonPath);
  console.log('[main] keysAddon loaded:', addonPath);
} catch (e) {
  console.error('[main] failed to load keysAddon:', addonPath, e);
  // fallback stub so main process doesn't crash while debugging
  keysAddon = { sendCombo: (...args) => console.warn('[main] stub sendCombo', args) };
}

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
  console.log('[main] sendSequence', actions, delayMs);
  for (const action of actions) {
    const binding = currentTIABindings[action];
    if (Array.isArray(binding) && binding.length > 0) {
      try { keysAddon.sendCombo(binding, 80); } catch (e) {}
    }
    await new Promise(r => setTimeout(r, delayMs));
  }
}

function registerActionShortcuts() {
  console.log('[main] registerActionShortcuts currentLocalMap=', currentLocalMap);
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
      console.log('[main] registerActionShortcuts register', acc, 'for', action, 'ok=', ok);
      if (ok) registeredActionKeys.add(acc);
    } catch (e) {}
  }
}

function unregisterActionShortcuts() {
  console.log('[main] unregisterActionShortcuts keys=', Array.from(registeredActionKeys));
  for (const acc of Array.from(registeredActionKeys)) {
    try { globalShortcut.unregister(acc); } catch (e) { console.error('[main] unregister error', e); }
    registeredActionKeys.delete(acc);
  }
}

function registerToggleKey() {
  console.log('[main] registerToggleKey currentToggleKey=', currentToggleKey, 'previous=', previousToggleKey);
  try {
    if (previousToggleKey && previousToggleKey !== currentToggleKey) {
      globalShortcut.unregister(previousToggleKey);
    }
  } catch (e) { console.error('[main] unregister previous toggle key failed', e); }

  try { globalShortcut.unregister(currentToggleKey); } catch (e) { /* ignore */ }
  try {
    const ok = globalShortcut.register(currentToggleKey, () => {
      enabled = !enabled;
      console.log('[main] toggle shortcut pressed, enabled=', enabled);
      if (enabled) registerActionShortcuts(); else unregisterActionShortcuts();
      if (win && win.webContents) win.webContents.send('enabled-changed', enabled);
    });
    console.log('[main] registerToggleKey result for', currentToggleKey, 'ok=', ok);
    if (ok) previousToggleKey = currentToggleKey;
  } catch (e) { console.error('[main] registerToggleKey error', e); }
}

function createWindow() {
  console.log('[main] createWindow');
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
  console.log('[main] ipc update-shortcuts', payload);
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
  console.log('[main] ipc toggle-request received, enabled before=', enabled);
  enabled = !enabled;
  console.log('[main] toggled enabled ->', enabled);
  if (enabled) registerActionShortcuts(); else unregisterActionShortcuts();
  if (win && win.webContents) win.webContents.send('enabled-changed', enabled);
});