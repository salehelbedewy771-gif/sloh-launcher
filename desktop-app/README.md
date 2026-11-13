# SLOH Launcher Desktop App (early development)

Electron desktop shell for the SLOH Launcher project.

## Run on Windows
1. Install Node.js 20 or newer.
2. Open a terminal in `desktop-app`.
3. Run `npm install`.
4. Run `npm start`.

Build installers with `npm run dist`.

## Current implementation
- Dark desktop UI with Home, Profiles, Versions, and Settings pages.
- Local JSON configuration in Electron's user-data directory.
- Profile CRUD and official Mojang version-manifest browsing (releases, snapshots, and old versions).
- Offline username validation and Microsoft device-code authentication integration.
- Vanilla launch adapter with progress and game log events.

## Not yet complete
- Microsoft-authenticated game launch adapter and full Xbox/Minecraft entitlement handling.
- Fabric, Forge, and Quilt installer integration.
- Cross-platform Java auto-detection and robust process lifecycle management.
- Automated tests and signed installers.

The UI does not claim these unfinished features are ready. Use a legitimate Minecraft Java account for online play. Offline mode does not grant access to paid multiplayer servers or bypass account ownership.

SLOH Launcher is an independent project and is not affiliated with Mojang or Microsoft.
