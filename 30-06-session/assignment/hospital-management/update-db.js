const fs = require('fs');
const dbPath = 'db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Slugify function to create nice emails like zehra.yilmaz@yedikule.com
function slugify(text) {
  return text.toLowerCase()
    .replace(/dr\.\s*/g, '')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/\s+/g, '.');
}

data.users = data.users.map(u => ({
  ...u,
  email: u.email || `${slugify(u.name)}@yedikule.com`,
  password: u.password || '123456'
}));

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
console.log('db.json updated successfully');
