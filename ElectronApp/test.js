const path = require('path');

// carica l'addon compilato
const addon = require('./build/Release/keyaddon.node');

// dopo 2 secondi manda, per esempio, ctrl+f2
setTimeout(() => {
  console.log('Sending keys...');
  addon.sendCombo(['alt', 'f1'], 100);
  console.log('Done');
}, 2000);