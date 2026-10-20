// Fire a demo "breaking" card at the running server so you can watch it arrive
// live in the web/mobile clients. Usage: node scripts/publish-demo.js
const base = process.env.PP_API || 'http://localhost:4000';
const card = {
  lang: 'en',
  title: 'BREAKING · Council pulls water tenders from Thursday agenda',
  content:
    'Minutes before publication, the standing committee removed the water-tender ' +
    'item from Thursday\'s agenda. Public Pressure has asked the chair why. The ' +
    'unpublished 2024 awards remain in force. We are staying on it.',
  sourceName: 'Live · ' + new Date().toLocaleTimeString(),
  categories: ['investigation', 'live'],
  live: true,
};
const res = await fetch(base + '/editorial/publish', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ card, breaking: true }),
});
console.log(res.status, await res.json());
