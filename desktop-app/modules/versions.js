const https = require("node:https");
const MANIFEST = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";
function getJson(url) {
  return new Promise((resolve, reject) => https.get(url, res => {
    if (res.statusCode !== 200) return reject(new Error("Minecraft version service returned HTTP " + res.statusCode));
    let body = ""; res.setEncoding("utf8"); res.on("data", chunk => body += chunk);
    res.on("end", () => { try { resolve(JSON.parse(body)); } catch { reject(new Error("Could not read the Minecraft version list.")); } });
  }).on("error", reject));
}
async function refresh() { return getJson(MANIFEST); }
async function list() {
  const data = await refresh();
  return { latest: data.latest, versions: data.versions.map(v => ({ id: v.id, type: v.type, releaseTime: v.releaseTime })) };
}
module.exports = { list, refresh, getJson };
