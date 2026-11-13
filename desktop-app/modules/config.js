const fs = require("node:fs");
const path = require("node:path");
let file;
const defaults = { javaPath: "", gameDirectory: "", defaultRam: 4, account: null, profiles: [] };
function init(userData) {
  const dir = path.join(userData, "SLOH Launcher");
  fs.mkdirSync(dir, { recursive: true });
  file = path.join(dir, "config.json");
  if (!fs.existsSync(file)) write(defaults);
}
function get() {
  try { return { ...defaults, ...JSON.parse(fs.readFileSync(file, "utf8")) }; }
  catch { return { ...defaults }; }
}
function write(value) { fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf8"); }
function update(patch) { const next = { ...get(), ...patch }; write(next); return next; }
module.exports = { init, get, update };
