const path = require("node:path");
let current = null;
function offline(username) {
  const name = String(username || "").trim();
  if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) throw new Error("Offline usernames must be 3–16 characters (letters, numbers, underscores).");
  current = { type: "offline", name, uuid: require("node:crypto").createHash("md5").update("OfflinePlayer:" + name).digest("hex") };
  return current;
}
async function microsoft() {
  // Uses prismarine-auth's Microsoft device-code flow. The library opens the official
  // Microsoft sign-in flow; never collect or store a Microsoft password in this app.
  const { Authflow, Titles } = require("prismarine-auth");
  const cache = path.join(require("node:os").homedir(), ".sloh-launcher", "auth");
  const flow = new Authflow("", cache, { authTitle: Titles.MinecraftJava, deviceType: "Win32" });
  const result = await flow.getMinecraftJavaToken({ fetchProfile: true });
  const profile = result.profile || result;
  if (!profile.id || !profile.name) throw new Error("Microsoft sign-in completed, but no Minecraft Java profile was found.");
  current = { type: "microsoft", name: profile.name, uuid: profile.id, accessToken: result.token };
  return { account: { type: "microsoft", name: profile.name, uuid: profile.id } };
}
function getAccount() { return current; }
module.exports = { offline, microsoft, getAccount };
