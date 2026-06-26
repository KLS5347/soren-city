#!/usr/bin/env node
// One-time migration: reads the JSON export → creates vault markdown files.
// After this runs, the vault is the source of truth.
const fs = require('fs');
const path = require('path');

const EXPORT = path.join(__dirname, '..', '..', 'Downloads', 'soren-city-export.json');
const VAULT = path.join(__dirname, '..', 'vault');

function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function ventureNote(v) {
  const lines = [
    '---',
    `id: ${v.id}`,
    `type: ${v.type}`,
    `realName: ${JSON.stringify(v.realName || v.name)}`,
    `col: ${v.col}`,
    `row: ${v.row}`,
    `status: ${v.status}`,
    `revenue: ${v.revenue || 0}`,
    '---',
    '',
    '## Notes',
    v.notes || '',
    '',
    '## Tasks',
  ];

  if (v.tasks?.length) {
    for (const t of v.tasks) lines.push(`- [${t.done ? 'x' : ' '}] ${t.text}`);
  } else {
    lines.push('- [ ] ');
  }

  lines.push('', '## Connections');
  if (v.connections?.length) {
    for (const c of v.connections) {
      lines.push(`- [[${c.name}]] — ${c.note || ''} (${c.status})`);
    }
  }

  lines.push('', '## Vault');
  if (v.vault?.length) {
    for (const item of v.vault) {
      const noteStr = item.note ? ` _(${item.note})_` : '';
      lines.push(`### ${item.name}${noteStr}`);
      if (item.kind === 'file') {
        lines.push('_(file asset — add path when available)_');
      } else if (item.content) {
        lines.push(item.content);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

function ideaNote(idea) {
  return [
    '---',
    `id: ${idea.id}`,
    `proposedBy: ${idea.proposedBy}`,
    `stage: ${idea.stage}`,
    'scores:',
    `  revenue: ${idea.scores.revenue}`,
    `  speed: ${idea.scores.speed}`,
    `  leverage: ${idea.scores.leverage}`,
    `  cost: ${idea.scores.cost}`,
    '---',
    '',
    idea.pitch || '',
    '',
  ].join('\n');
}

const data = JSON.parse(fs.readFileSync(EXPORT, 'utf8'));

mkdirp(path.join(VAULT, 'Kingdom'));
mkdirp(path.join(VAULT, 'Ventures'));
mkdirp(path.join(VAULT, 'Ideas'));
mkdirp(path.join(VAULT, 'Templates'));

// City.md
const realVentures = data.ventures.filter(v => v.type !== 'empty');
const cityLines = [
  '---',
  `cityName: ${JSON.stringify(data.cityName)}`,
  `ceo: ${JSON.stringify(data.ceo)}`,
  'gridCols: 4',
  'gridRows: 4',
  `lastUpdated: "${data.lastUpdated}"`,
  '---',
  '',
  `# ${data.cityName}`,
  '',
  `**Sovereign:** ${data.ceo}`,
  '',
  '## Kingdom Portal',
  '',
  '> [Open Kingdom](https://kalebsorenson.github.io/soren-city)',
  '',
  '## Ventures',
  '',
  ...realVentures.map(v => `- [[${v.name}]]`),
  "- [[The Town Crier's Guild]]",
  '',
  '## Ideas',
  '',
  ...data.ideas.map(i => `- [[${i.name}]]`),
  '',
];
fs.writeFileSync(path.join(VAULT, 'Kingdom', 'City.md'), cityLines.join('\n'));
console.log('✓  Kingdom/City.md');

// Ventures from JSON
for (const v of realVentures) {
  fs.writeFileSync(path.join(VAULT, 'Ventures', `${v.name}.md`), ventureNote(v));
  console.log(`✓  Ventures/${v.name}.md`);
}

// The Town Crier's Guild — new venture not in JSON
const guild = {
  id: 'guild',
  type: 'venture',
  name: "The Town Crier's Guild",
  realName: 'Outreach & Lead-Gen Engine',
  col: 0,
  row: 1,
  status: 'building',
  revenue: 0,
  notes: "Active customer-acquisition engine. Holds cold-email templates and a list of target businesses + their status (contacted / replied / closed).",
  tasks: [
    { id: 'g1', text: 'Build target business list (local businesses)', done: false },
    { id: 'g2', text: 'Write cold-email templates (chatbot pitch)', done: false },
    { id: 'g3', text: 'Send first batch of 10 outreach emails', done: false },
    { id: 'g4', text: 'Track replies and follow-ups in this note', done: false },
  ],
  connections: [],
  vault: [
    { id: 'gv1', name: 'Cold email template', kind: 'text', note: 'chatbot pitch', content: '_(write your template here)_' },
    { id: 'gv2', name: 'Target business list', kind: 'text', note: 'name / status', content: '| Business | Status |\n|----------|--------|\n| | |' },
  ],
};
fs.writeFileSync(path.join(VAULT, 'Ventures', `${guild.name}.md`), ventureNote(guild));
console.log(`✓  Ventures/${guild.name}.md`);

// Ideas
for (const idea of data.ideas) {
  fs.writeFileSync(path.join(VAULT, 'Ideas', `${idea.name}.md`), ideaNote(idea));
  console.log(`✓  Ideas/${idea.name}.md`);
}

// Templates
const ventureTemplate = [
  '---',
  'id: ',
  'type: venture',
  'realName: ""',
  'col: 0',
  'row: 0',
  'status: building',
  'revenue: 0',
  '---',
  '',
  '## Notes',
  '',
  '## Tasks',
  '- [ ] ',
  '',
  '## Connections',
  '',
  '## Vault',
  '',
].join('\n');

const ideaTemplate = [
  '---',
  'id: ',
  'proposedBy: Claude',
  'stage: proposed',
  'scores:',
  '  revenue: 0',
  '  speed: 0',
  '  leverage: 0',
  '  cost: 0',
  '---',
  '',
  '_(pitch goes here)_',
  '',
].join('\n');

fs.writeFileSync(path.join(VAULT, 'Ventures', '_template.md'), ventureTemplate);
fs.writeFileSync(path.join(VAULT, 'Ideas', '_template.md'), ideaTemplate);
fs.writeFileSync(path.join(VAULT, 'Templates', 'Venture Template.md'), ventureTemplate);
fs.writeFileSync(path.join(VAULT, 'Templates', 'Idea Template.md'), ideaTemplate);
console.log('✓  Templates written');

console.log('\nMigration complete — vault is now the source of truth.');
console.log('Run: npm run build-data && npm --prefix kingdom run dev');
