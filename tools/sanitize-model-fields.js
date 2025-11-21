const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'component-models.json');
const backup = `${file}.bak`;

const data = JSON.parse(fs.readFileSync(file, 'utf8'));

let changed = 0;

function sanitizeName(name) {
  // Only transform names that start with col<digits>_
  const m = name.match(/^(col\d+_)(.+)$/);
  if (!m) return name;
  const prefix = m[1];
  const rest = m[2];
  const newRest = rest.replace(/_/g, '-');
  const newName = prefix + newRest;
  if (newName !== name) changed++;
  return newName;
}

// Walk models
if (Array.isArray(data)) {
  data.forEach((model) => {
    if (model && Array.isArray(model.fields)) {
      model.fields.forEach((field) => {
        if (field && typeof field.name === 'string') {
          field.name = sanitizeName(field.name);
        }
      });
    }
  });
}

// write backup and overwrite
fs.copyFileSync(file, backup);
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log('Sanitize complete. Fields changed:', changed);
console.log('Backup written to', backup);
