const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const blocksDir = path.join(root, 'blocks');
const defPath = path.join(root, 'component-definition.json');
const modelsPath = path.join(root, 'component-models.json');
const filtersPath = path.join(root, 'component-filters.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

const def = readJson(defPath);
const models = readJson(modelsPath);
const filters = readJson(filtersPath);

// flatten component definitions
const defComponents = [];
if (def && Array.isArray(def.groups)) {
  def.groups.forEach((g) => {
    if (Array.isArray(g.components)) g.components.forEach((c) => defComponents.push(c));
  });
}

const defMap = new Map(defComponents.map((d) => [d.id, d]));
const modelsMap = new Map((models || []).map((m) => [m.id, m]));
const filtersMap = new Map((filters || []).map((f) => [f.id, f]));

// list block directories
const blockDirs = fs.readdirSync(blocksDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

console.log('Blocks found:', blockDirs.length);

blockDirs.forEach((blockId) => {
  const out = { definitions: [], models: [], filters: [] };

  // include direct definition by id
  if (defMap.has(blockId)) out.definitions.push(defMap.get(blockId));

  // include definition/models referenced by filters whose id === blockId
  if (filtersMap.has(blockId)) {
    const f = filtersMap.get(blockId);
    out.filters.push(f);
    if (Array.isArray(f.components)) {
      f.components.forEach((compId) => {
        if (defMap.has(compId)) out.definitions.push(defMap.get(compId));
        if (modelsMap.has(compId)) out.models.push(modelsMap.get(compId));
      });
    }
  }

  // include definitions that have template.model or template.filter matching blockId
  defComponents.forEach((d) => {
    try {
      const tpl = d.plugins && d.plugins.xwalk && d.plugins.xwalk.page && d.plugins.xwalk.page.template;
      if (!tpl) return;
      if (tpl.model === blockId || tpl.filter === blockId) {
        if (!out.definitions.find((x) => x.id === d.id)) out.definitions.push(d);
      }
    } catch (e) {
      // ignore
    }
  });

  // include common related models: blockId, blockId-item
  ['', '-item'].forEach((suffix) => {
    const id = blockId + (suffix === '' ? '' : suffix);
    if (modelsMap.has(id) && !out.models.find((m) => m.id === id)) out.models.push(modelsMap.get(id));
    if (defMap.has(id) && !out.definitions.find((d) => d.id === id)) out.definitions.push(defMap.get(id));
  });

  // If any definitions reference other model ids via template.model, include those models
  out.definitions.forEach((d) => {
    try {
      const tpl = d.plugins && d.plugins.xwalk && d.plugins.xwalk.page && d.plugins.xwalk.page.template;
      if (tpl && tpl.model && modelsMap.has(tpl.model) && !out.models.find((m) => m.id === tpl.model)) {
        out.models.push(modelsMap.get(tpl.model));
      }
      if (tpl && tpl.filter && filtersMap.has(tpl.filter) && !out.filters.find((ff) => ff.id === tpl.filter)) {
        out.filters.push(filtersMap.get(tpl.filter));
      }
    } catch (e) {}
  });

  // dedupe by id
  out.definitions = out.definitions.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i);
  out.models = out.models.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i);
  out.filters = out.filters.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i);

  const dest = path.join(blocksDir, blockId, `_${blockId}.json`);
  writeJson(dest, out);
  console.log('Wrote', dest);
});

console.log('Done.');
