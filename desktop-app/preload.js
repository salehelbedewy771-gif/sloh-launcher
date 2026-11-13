const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("sloh", {
  getConfig: () => ipcRenderer.invoke("config:get"),
  updateConfig: patch => ipcRenderer.invoke("config:update", patch),
  listProfiles: () => ipcRenderer.invoke("profiles:list"),
  saveProfile: profile => ipcRenderer.invoke("profiles:save", profile),
  deleteProfile: id => ipcRenderer.invoke("profiles:delete", id),
  listVersions: () => ipcRenderer.invoke("versions:list"),
  refreshVersions: () => ipcRenderer.invoke("versions:refresh"),
  offlineLogin: name => ipcRenderer.invoke("auth:offline", name),
  microsoftLogin: () => ipcRenderer.invoke("auth:microsoft"),
  launch: id => ipcRenderer.invoke("game:launch", id),
  openExternal: url => ipcRenderer.invoke("app:openExternal", url),
  onProgress: callback => ipcRenderer.on("launcher:progress", (_, data) => callback(data)),
  onLog: callback => ipcRenderer.on("launcher:log", (_, data) => callback(data))
});
