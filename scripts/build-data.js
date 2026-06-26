#!/usr/bin/env node
// Reads vault markdown files → generates kingdom/public/data.json
// Run before every deploy. Safe to run repeatedly.
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const VAULT = path.join(__dirname, '..', 'vault');
const OUT = path.join(__dirname, '..', 'kingdom', 'public', 'data.json');

function readMd(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return matter(raw);
}

function parseSection(body, header) {
  const re = new RegExp(`^## ${header}\\s*$`, 'm');
  const start = body.search(re);
  if (start === -1) return '';
  const afterHeader = body.indexOf('\n', start) + 1;
  const nextSection = body.indexOf('\n## ', afterHeader);
  return (nextSection === -1 ? body.slice(afterHeader) : body.slice(afterHeader, nextSection)).trim();
}

function parseTasks(body) {
  const section = parseSection(body, 'Tasks');
  return section.split('\n')
    .map(l => l.match(/^- \[([ x])\] (.+)$/))
    .filter(Boolean)
    .map(m => ({ done: m[1] === 'x', text: m[2].trim() }));
}

function parseConnections(body) {
  const section = parseSection(body, 'Connections');
  return section.split('\n')
    .map(l => l.match(/^- \[\[(.+?)\]\](.*)?$/))
    .filter(Boolean)
    .map(m => ({ name: m[1].trim(), note: m[2]?.replace(/^[^a-z]*/i, '').trim() || '' }));
}

function parseVaultItems(body) {
  const section = parseSection(body, 'Vault');
  if (!section) return [];
  const items = [];
  const lines = section.split('\n');
  let current = null;
  let contentLines = [];

  for (const line of lines) {
    const h3 = line.match(/^### (.+?)(?:\s+_\((.+?)\)_)?$/);
    if (h3) {
      if (current) items.push({ ...current, content: contentLines.join('\n').trim() });
      current = { name: h3[1].trim(), note: h3[2]?.trim() || '' };
      contentLines = [];
    } else if (current) {
      contentLines.push(line);
    }
  }
  if (current) items.push({ ...current, content: contentLines.join('\n').trim() });
  return items;
}

function loadVentures() {
  const dir = path.join(VAULT, 'Ventures');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(f => {
      const { data: fm, content: body } = readMd(path.join(dir, f));
      const name = f.replace(/\.md$/, '');

      // Honesty rule: earning requires revenue > 0
      let status = fm.status || 'building';
      if (status === 'earning' && (fm.revenue || 0) <= 0) {
        console.warn(`⚠  ${name}: demoted from earning→building (revenue = 0)`);
        status = 'building';
      }

      return {
        id: fm.id || name.toLowerCase().replace(/\s+/g, '-'),
        type: fm.type || 'venture',
        name,
        realName: fm.realName || name,
        col: fm.col ?? 0,
        row: fm.row ?? 0,
        status,
        revenue: fm.revenue || 0,
        notes: parseSection(body, 'Notes'),
        tasks: parseTasks(body),
        connections: parseConnections(body),
        vault: parseVaultItems(body),
      };
    });
}

function loadIdeas() {
  const dir = path.join(VAULT, 'Ideas');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(f => {
      const { data: fm, content: body } = readMd(path.join(dir, f));
      const name = f.replace(/\.md$/, '');
      return {
        id: fm.id || name.toLowerCase().replace(/\s+/g, '-'),
        name,
        proposedBy: fm.proposedBy || 'Claude',
        stage: fm.stage || 'proposed',
        scores: {
          revenue: fm.scores?.revenue ?? 0,
          speed: fm.scores?.speed ?? 0,
          leverage: fm.scores?.leverage ?? 0,
          cost: fm.scores?.cost ?? 0,
        },
        pitch: body.trim(),
      };
    });
}

function loadCity() {
  const file = path.join(VAULT, 'Kingdom', 'City.md');
  if (!fs.existsSync(file)) {
    return { cityName: 'Soren City', ceo: 'Kaleb Sorenson', gridCols: 4, gridRows: 4 };
  }
  const { data: fm } = readMd(file);
  return {
    cityName: fm.cityName || 'Soren City',
    ceo: fm.ceo || 'Kaleb Sorenson',
    gridCols: fm.gridCols || 4,
    gridRows: fm.gridRows || 4,
    lastUpdated: fm.lastUpdated || new Date().toISOString(),
  };
}

const city = loadCity();
const ventures = loadVentures();
const ideas = loadIdeas();

const output = JSON.stringify({ city, ventures, ideas }, null, 2);

const outDir = path.dirname(OUT);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(OUT, output);

console.log(`✓  data.json — ${ventures.length} ventures, ${ideas.length} ideas`);
