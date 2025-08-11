#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const file = 'config/feature-flags.json';
const mode = process.argv[2]; // 'on' | 'off'

if (!['on','off'].includes(mode)) { 
  console.error('Uso: node scripts/flags.mjs <on|off>'); 
  process.exit(1); 
}

try {
  const json = JSON.parse(fs.readFileSync(file,'utf8'));
  json.comingSoon = mode === 'on';
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
  console.log(`✅ COMING_SOON = ${json.comingSoon}`);
  console.log(`📝 Archivo actualizado: ${file}`);
} catch (error) {
  console.error('❌ Error al actualizar flags:', error.message);
  process.exit(1);
}
