const { randomUUID } = require("node:crypto");
const config = require("./config");
function list() { return config.get().profiles || []; }
function save(input) {
  if (!input.name?.trim()) throw new Error("Give this profile a name.");
  if (!input.version) throw new Error("Choose a Minecraft version.");
  const all = list();
  const item = { id: input.id || randomUUID(), name: input.name.trim(), version: input.version,
    loader: input.loader || "vanilla", ram: Math.max(2, Math.min(16, Number(input.ram) || 4)) };
  const index = all.findIndex(p => p.id === item.id);
  if (index >= 0) all[index] = item; else all.push(item);
  config.update({ profiles: all });
  return item;
}
function remove(id) { config.update({ profiles: list().filter(p => p.id !== id) }); return list(); }
module.exports = { list, save, remove };
