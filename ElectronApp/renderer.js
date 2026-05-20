const { ipcRenderer } = require('electron');
console.log('[renderer] loaded');

const TIA_BINDINGS = {
  open:   ['f9'],           // Contatto aperto  → F9
  closed: ['f10'],          // Contatto chiuso  → F10
  coil:   ['shift', 'f7'],  // Bobina           → Shift+F7
  func:   ['f8'],           // Funzione         → F8
  up:     ['shift', 'f9'],  // Linea su         → Shift+F9
  down:   ['shift', 'f8'],  // Linea giù        → Shift+F8
  left:   ['arrowleft'],    // invariato (usato nelle macro)
  right:  ['arrowright']    // invariato (usato nelle macro)
};

function comboLabel(arr) {
  return arr.map(k => {
    if (k === 'arrowup')    return '↑';
    if (k === 'arrowdown')  return '↓';
    if (k === 'arrowleft')  return '←';
    if (k === 'arrowright') return '→';
    return k.charAt(0).toUpperCase() + k.slice(1);
  }).join('+');
}

function refreshBindingLabels() {
  document.querySelectorAll('.binding-val').forEach(el => {
    const action = el.dataset.action;
    if (TIA_BINDINGS[action]) el.textContent = comboLabel(TIA_BINDINGS[action]);
  });
}

refreshBindingLabels();

// Comunica le mappature e richieste di toggle al processo main
function sendUpdate(enabled = false) {
  const payload = {
    localMap: getLocalMap(),
    tiaBindings: TIA_BINDINGS,
    macros: MACROS,
    toggleKey: (toggleKeyInput.value || 'CapsLock').trim(),
    enabled
  };
  console.log('[renderer] sendUpdate', payload.enabled, payload.toggleKey, payload.localMap);
  ipcRenderer.send('update-shortcuts', payload);
}

// Macro definite come array di azioni
const MACROS = {
  w: {
    label: 'Contatti paralleli',
    sequence: ['left','down','open','up','right']
  }
};

const hkInputs = {
  open:   document.getElementById('hk-open'),
  closed: document.getElementById('hk-closed'),
  coil:   document.getElementById('hk-coil'),
  func:   document.getElementById('hk-func'),
  up:     document.getElementById('hk-up'),
  down:   document.getElementById('hk-down'),
  w:      document.getElementById('hk-w')
};

function getLocalMap() {
  const map = {};
  for (const [action, el] of Object.entries(hkInputs)) {
    const k = (el.value || '').trim();
    if (k) map[k] = action;
  }
  return map;
}

let enabled = false;
const toggleBtn      = document.getElementById('toggle-btn');
const toggleLabel    = document.getElementById('toggle-label');
const statusDot      = document.getElementById('status-dot');
const statusText     = document.getElementById('status-text');
const toggleKeyInput = document.getElementById('toggle-key');
let recordingToggle = false;

function startRecordingToggle() {
  recordingToggle = true;
  toggleKeyInput.placeholder = 'Premi un tasto o clicca il mouse...';
  toggleKeyInput.classList.add('recording');
  // attach temporary listeners
  const onKey = (e) => {
    e.preventDefault();
    const val = e.key || e.code;
    stopRecording(val);
  };
  const onMouse = (e) => {
    e.preventDefault();
    let val = 'Mouse';
    if (e.button === 0) val = 'MouseLeft';
    else if (e.button === 1) val = 'MouseMiddle';
    else if (e.button === 2) val = 'MouseRight';
    else val = 'MouseButton' + e.button;
    stopRecording(val);
  };
  const onWheel = (e) => {
    e.preventDefault();
    const val = e.deltaY < 0 ? 'WheelUp' : 'WheelDown';
    stopRecording(val);
  };
  document.addEventListener('keydown', onKey, { once: true });
  document.addEventListener('mousedown', onMouse, { once: true });
  document.addEventListener('wheel', onWheel, { once: true });
  // store the handlers so we could remove them if needed
  toggleKeyInput._recHandlers = { onKey, onMouse, onWheel };
}

function stopRecording(value) {
  recordingToggle = false;
  toggleKeyInput.classList.remove('recording');
  if (toggleKeyInput._recHandlers) {
    try { document.removeEventListener('keydown', toggleKeyInput._recHandlers.onKey); } catch (e) {}
    try { document.removeEventListener('mousedown', toggleKeyInput._recHandlers.onMouse); } catch (e) {}
    try { document.removeEventListener('wheel', toggleKeyInput._recHandlers.onWheel); } catch (e) {}
    toggleKeyInput._recHandlers = null;
  }
  toggleKeyInput.placeholder = '';
  if (value) {
    toggleKeyInput.value = value;
    // inform main about the changed toggle key
    sendUpdate(enabled);
  }
}

function setEnabled(on) {
  enabled = on;
  toggleBtn.classList.toggle('on', on);
  toggleBtn.setAttribute('aria-checked', String(on));
  toggleLabel.textContent = on ? 'Stato: Abilitato' : 'Stato: Disabilitato';
  statusDot.classList.toggle('active', on);
  statusText.textContent = on
    ? 'Listener attivo — in ascolto sui tasti locali'
    : 'Listener disattivo — nessun tasto intercettato';
}
toggleBtn.addEventListener('click', () => { ipcRenderer.send('toggle-request'); });
toggleBtn.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ipcRenderer.send('toggle-request'); }
});
// instrument toggle clicks
toggleBtn.addEventListener('click', () => { console.log('[renderer] toggle click -> send toggle-request'); });

// invia aggiornamenti quando cambiano gli input
Object.values(hkInputs).forEach(el => el.addEventListener('change', () => sendUpdate(enabled)));
toggleKeyInput.addEventListener('change', () => sendUpdate(enabled));
// start recording when the input is focused or double-clicked
toggleKeyInput.addEventListener('focus', () => startRecordingToggle());
toggleKeyInput.addEventListener('dblclick', () => startRecordingToggle());

// riceve stato abilitazione dal main
ipcRenderer.on('enabled-changed', (evt, on) => setEnabled(on));

// invio iniziale delle mappature al main
ipcRenderer.on('enabled-changed', (evt, on) => { console.log('[renderer] enabled-changed', on); setEnabled(on); });

// invio iniziale delle mappature al main
sendUpdate(false);
