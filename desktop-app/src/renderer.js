const $ = id => document.getElementById(id);
let profiles = [], versions = [], config = {};
function log(message) { const el=$("console"); el.textContent += "\\n" + message; el.scrollTop=el.scrollHeight; }
function notifyError(error) { log("ERROR: " + (error?.message || error)); alert(error?.message || String(error)); }
function showPage(name) {
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  $("page-"+name).classList.remove("hidden");
  document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  $("page-title").textContent={home:"Welcome back.",profiles:"Your profiles.",versions:"Version library.",settings:"Launcher settings."}[name];
}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
$("profile-shortcut").onclick=()=>showPage("profiles");
$("offline-btn").onclick=async()=>{try{const a=await window.sloh.offlineLogin($("offline-name").value); $("account-state").textContent="Offline · "+a.name; log("Offline profile selected: "+a.name);}catch(e){notifyError(e);}};
$("microsoft-btn").onclick=async()=>{try{const a=await window.sloh.microsoftLogin(); $("account-state").textContent="Microsoft · "+a.name; log("Microsoft account connected: "+a.name);}catch(e){notifyError(e);}};
function renderProfiles(){
  $("profile-list").innerHTML="";
  if(!profiles.length){$("profile-list").innerHTML='<div class="panel empty">No profiles yet. Create your first profile.</div>'; $("active-profile").textContent="No profile selected.";return;}
  profiles.forEach(p=>{const card=document.createElement("article");card.className="profile-card";card.innerHTML='<h3></h3><p></p><button class="secondary">Launch</button><button class="secondary">Delete</button>';card.querySelector("h3").textContent=p.name;card.querySelector("p").textContent=p.version+" · "+p.loader+" · "+p.ram+" GB RAM";card.querySelectorAll("button")[0].onclick=()=>launch(p.id);card.querySelectorAll("button")[1].onclick=async()=>{profiles=await window.sloh.deleteProfile(p.id);renderProfiles();};$("profile-list").append(card);});
  const p=profiles[0];$("active-profile").textContent=p.name+" · Minecraft "+p.version+" · "+p.loader;
}
async function loadVersions(){try{const result=await window.sloh.listVersions();versions=result.versions;$("p-version").innerHTML="";versions.forEach(v=>{const o=document.createElement("option");o.value=v.id;o.textContent=v.id+" ("+v.type+")";$("p-version").append(o);});$("version-list").innerHTML="";versions.forEach(v=>{const row=document.createElement("div");row.className="version-row";const a=document.createElement("span"),b=document.createElement("span");a.textContent=v.id;b.textContent=v.type;row.append(a,b);$("version-list").append(row);});}catch(e){$("version-list").textContent="Could not load versions: "+e.message;}}
function openForm(){ $("profile-form").classList.remove("hidden");$("p-ram").value=config.defaultRam||4; }
$("new-profile").onclick=openForm;$("cancel-profile").onclick=()=>$("profile-form").classList.add("hidden");
$("save-profile").onclick=async()=>{try{const p=await window.sloh.saveProfile({name:$("p-name").value,version:$("p-version").value,loader:$("p-loader").value,ram:$("p-ram").value});profiles=await window.sloh.listProfiles();renderProfiles();$("profile-form").classList.add("hidden");log("Profile saved: "+p.name);}catch(e){notifyError(e);}};
async function launch(id){try{log("Starting launch request…");await window.sloh.launch(id);}catch(e){notifyError(e);}}
$("play-btn").onclick=()=>profiles.length?launch(profiles[0].id):showPage("profiles");
$("refresh-versions").onclick=loadVersions;
$("save-settings").onclick=async()=>{try{config=await window.sloh.updateConfig({javaPath:$("java-path").value,gameDirectory:$("game-dir").value,defaultRam:Number($("default-ram").value)});log("Settings saved.");}catch(e){notifyError(e);}};
window.sloh.onLog(message=>log(message));
window.sloh.onProgress(p=>{const percent=p.total?Math.round(p.task/p.total*100):0;$("progress-bar").style.width=percent+"%";$("progress-label").textContent=p.type? p.type+" · "+percent+"%":percent+"%";});
(async()=>{try{config=await window.sloh.getConfig();profiles=await window.sloh.listProfiles();$("java-path").value=config.javaPath||"";$("game-dir").value=config.gameDirectory||"";$("default-ram").value=config.defaultRam||4;renderProfiles();await loadVersions();}catch(e){notifyError(e);}})();
