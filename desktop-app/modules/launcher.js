const path = require("node:path");
const fs = require("node:fs");
const { Client } = require("minecraft-launcher-core");
async function launch(profile, settings, account, emit) {
  if (!account) throw new Error("Sign in with Microsoft or choose an offline username first.");
  if (account.type === "microsoft") throw new Error("Microsoft authentication is connected, but the current launcher-core adapter needs to be completed before online launch. Offline launch is available now.");
  const root = settings.gameDirectory || path.join(require("node:os").homedir(), "AppData", "Roaming", ".minecraft");
  fs.mkdirSync(root, { recursive: true });
  const launcher = new Client();
  launcher.on("debug", line => emit("launcher:log", String(line)));
  launcher.on("data", line => emit("launcher:log", String(line)));
  launcher.on("progress", progress => emit("launcher:progress", progress));
  launcher.on("close", code => emit("launcher:log", "Minecraft exited with code " + code));
  const options = {
    authorization: { access_token: "0", client_token: "sloh-launcher", uuid: account.uuid, name: account.name, user_properties: "{}" },
    root, version: { number: profile.version, type: "release" },
    memory: { max: profile.ram + "G", min: "2G" },
    javaPath: settings.javaPath || undefined
  };
  emit("launcher:log", "Preparing Minecraft " + profile.version + " (" + profile.loader + ")...");
  if (profile.loader !== "vanilla") throw new Error("The " + profile.loader + " installer is not yet integrated. Vanilla profiles are supported in this first desktop scaffold.");
  launcher.launch(options);
  return { started: true };
}
module.exports = { launch };
