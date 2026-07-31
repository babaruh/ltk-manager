/**
 * In-memory fake backend for `pnpm dev:web` — running the frontend alone in a
 * real browser tab (via `@tauri-apps/*` shims in `src/dev/tauriShims`) for
 * faster UI iteration, without waiting on a full `cargo`/WebView2 relaunch for
 * every change. Dev-only: never imported by the real Tauri build.
 */
import type {
  AppInfo,
  DiagnosticReport,
  InstalledMod,
  LaunchAvailability,
  LibraryFolder,
  PatcherStatus,
  PlatformSupport,
  Profile,
  Settings,
  WorkshopProject,
} from "@/lib/bindings";

function mod(overrides: Partial<InstalledMod> & Pick<InstalledMod, "id" | "displayName">) {
  const base: InstalledMod = {
    id: overrides.id,
    name: overrides.id,
    displayName: overrides.displayName,
    version: "1.0.0",
    description: "",
    authors: ["Unknown"],
    enabled: false,
    installedAt: "2025-01-01T00:00:00.000Z",
    layers: [{ name: "base", displayName: "Base", priority: 0, enabled: true }],
    tags: [],
    champions: [],
    maps: [],
    modDir: `/mock/mods/${overrides.id}`,
    folderId: null,
  };
  return { ...base, ...overrides };
}

export const state = {
  settings: {
    leaguePath: "C:/Riot Games/League of Legends",
    modStoragePath: null,
    workshopPath: null,
    firstRunComplete: true,
    theme: "dark",
    accentColor: { preset: "blue", customHue: null },
    backdropImage: null,
    backdropBlur: null,
    libraryViewMode: "grid",
    patchTft: false,
    minimizeToTray: true,
    startInTray: false,
    migrationDismissed: true,
    reloadModsHotkey: null,
    killLeagueHotkey: null,
    killLeagueStopsPatcher: true,
    trustedDomains: ["runeforge.dev", "divineskins.gg"],
    watcherEnabled: false,
    blockScriptsWad: true,
    linkedBinCheckEnabled: true,
    wadBlocklist: [],
    authorProfiles: [],
    defaultAuthorProfileId: null,
    autoRun: false,
    startInTrayUnlessUpdate: false,
    alwaysStartPatcher: false,
    autoStartPatcherOnLeagueLaunch: false,
    launchMode: "classic",
    hasSeenHddWarning: true,
    elevateInjector: false,
    autoCategorizationEnabled: true,
    enforceSkinhackScan: true,
    applyStringOverridesToAllLocales: false,
    verbosePatcherLogging: false,
    lazyWadScan: false,
    hideRiotClientOnLaunch: true,
  } satisfies Settings as Settings,

  mods: [
    mod({
      id: "unbound-vayne",
      displayName: "Unbound Vayne",
      version: "2.0.0",
      authors: ["AryasDemise"],
      enabled: true,
      champions: ["Vayne"],
    }),
    mod({
      id: "tommy-vercetti-vayne",
      displayName: "Tommy Vercetti Vayne",
      champions: ["Vayne"],
    }),
    mod({
      id: "dragon-dagger-rengar",
      displayName: "Dragon Dagger Rengar",
      version: "1.1.0",
      authors: ["Kingz3"],
      enabled: true,
      tags: ["skin"],
      champions: ["Rengar"],
    }),
    mod({
      id: "rengar-repathed-mod",
      displayName: "Rengar Repathed Mod",
      authors: ["League Mod Repather"],
      champions: ["Rengar"],
    }),
    mod({
      id: "high-noon-rengar",
      displayName: "High Noon Rengar",
      version: "2.0.0",
      authors: ["AryasDemise"],
      enabled: true,
      tags: ["skin"],
      champions: ["Rengar"],
    }),
    mod({
      id: "batman-rengar",
      displayName: "Batman Rengar",
      version: "1.1.0",
      authors: ["Mundonator"],
      champions: ["Rengar"],
    }),
  ] as InstalledMod[],

  profiles: [
    {
      id: "default",
      name: "Default",
      slug: "default",
      enabledMods: [],
      modOrder: [],
      layerStates: {},
      createdAt: "2025-01-01T00:00:00.000Z",
      lastUsed: "2025-01-01T00:00:00.000Z",
    },
  ] as Profile[],
  activeProfileId: "default",

  folders: [] as LibraryFolder[],

  patcherStatus: {
    running: false,
    overlayPrefix: null,
    phase: "idle",
  } as PatcherStatus,

  workshopProjects: [] as WorkshopProject[],
};

export const appInfo: AppInfo = {
  name: "LTK Manager",
  version: "1.13.2",
  logFilePath: null,
  os: "windows",
  arch: "x86_64",
};

export const platformSupport: PlatformSupport = {
  os: "windows",
  patcherAvailable: true,
  hotkeysAvailable: true,
};

export const launchAvailability: LaunchAvailability = {
  canLaunch: true,
  riotClientPath: "C:/Riot Games/Riot Client/RiotClientServices.exe",
  riotClientRunning: true,
  leagueRunning: false,
};

export const diagnosticReport: DiagnosticReport = {
  generatedAt: new Date().toISOString(),
  appVersion: appInfo.version,
  checks: [],
};
