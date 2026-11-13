const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("node:path");
const config = require("./modules/config");
const auth = require("./modules/auth");
const versions = require("./modules/versions");
const profiles = require("./modules/profiles");
const launcher = require("./modules/launcher");

let window;
function createWindow() {
  window = new BrowserWindow({
    width: 1180, height: 780, minWidth: 900, minHeight: 620,
    backgroundColor: "#0b0d12",
    title: "SLOH Launcher",
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false }
  });
  window.loadFile(path.join(__dirname, "src/index.html"));
}
app.whenReady().then(() => { config.init(app.getPath("userData")); createWindow(); });
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

const send = (event, payload) => window?.webContents.send(event, payload);
ipcMain.handle("config:get", () => config.get());
ipcMain.handle("config:update", (_, patch) => config.update(patch));
ipcMain.handle("profiles:list", () => profiles.list());
ipcMain.handle("profiles:save", (_, profile) => profiles.save(profile));
ipcMain.handle("profiles:delete", (_, id) => profiles.remove(id));
ipcMain.handle("versions:list", async () => versions.list());
ipcMain.handle("versions:refresh", async () => versions.refresh());
ipcMain.handle("auth:offline", (_, username) => auth.offline(username));
ipcMain.handle("auth:microsoft", async () => {
  const result = await auth.microsoft();
  config.update({ account: result.account });
  return result.account;
});
ipcMain.handle("game:launch", async (_, profileId) => {
  const profile = profiles.list().find(p => p.id === profileId);
  if (!profile) throw new Error("The selected profile could not be found.");
  return launcher.launch(profile, config.get(), auth.getAccount(), send);
});
ipcMain.handle("app:openExternal", (_, url) => {
  if (!/^https:\/\//i.test(url)) throw new Error("Only HTTPS links can be opened.");
  return shell.openExternal(url);
});
