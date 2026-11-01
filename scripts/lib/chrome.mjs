// Navegador del sistema para puppeteer-core (PDF y ui-check): Chrome o Edge,
// o la ruta de la variable de entorno BEASTY_CHROME.
import { existsSync } from 'node:fs';

export function findChrome() {
  if (process.env.BEASTY_CHROME) return process.env.BEASTY_CHROME;
  const candidatos = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const hallado = candidatos.find((c) => existsSync(c));
  if (!hallado) throw new Error('No encuentro Chrome ni Edge; define BEASTY_CHROME.');
  return hallado;
}
