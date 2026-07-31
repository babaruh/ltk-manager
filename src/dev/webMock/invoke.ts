import type { InstalledMod, LibraryFolder, Profile } from "@/lib/bindings";

import { appInfo, diagnosticReport, launchAvailability, platformSupport, state } from "./state";

function ok<T>(value: T) {
  return { ok: true as const, value };
}

let nextId = 1000;

/** Handles the `invoke(cmd, args)` calls the real app makes, against the
 * in-memory state in `./state`. Read commands return live state; write
 * commands mutate it so the UI reacts exactly like it would against the real
 * backend. Anything unhandled logs a warning and resolves to `undefined` -
 * fine for `Result<T | undefined>` call sites, a visible gap for the rest. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mockInvoke(cmd: string, args?: Record<string, unknown>): Promise<any> {
  switch (cmd) {
    case "get_app_info":
      return ok(appInfo);
    case "get_platform_support":
      return ok(platformSupport);
    case "show_main_window":
    case "prepare_for_update":
      return ok(undefined);

    case "get_settings":
      return ok(state.settings);
    case "save_settings":
      Object.assign(state.settings, args?.settings);
      return ok(undefined);
    case "auto_detect_league_path":
      return ok(state.settings.leaguePath);
    case "validate_league_path":
      return ok(true);
    case "check_setup_required":
      return ok(!state.settings.firstRunComplete);
    case "detect_league_run_as_admin":
      return ok(false);
    case "list_available_wads":
      return ok([]);

    case "get_installed_mods":
      return ok(state.mods);
    case "install_mod": {
      const filePath = String(args?.filePath ?? "New Mod.fantome");
      const name =
        filePath
          .split(/[/\\]/)
          .pop()
          ?.replace(/\.\w+$/, "") ?? "New Mod";
      const installed: InstalledMod = {
        id: `mock-${nextId++}`,
        name,
        displayName: name,
        version: "1.0.0",
        description: "",
        authors: ["You"],
        enabled: false,
        installedAt: new Date().toISOString(),
        layers: [{ name: "base", displayName: "Base", priority: 0, enabled: true }],
        tags: [],
        champions: [],
        maps: [],
        modDir: `/mock/mods/${name}`,
        folderId: null,
      };
      state.mods.push(installed);
      return ok(installed);
    }
    case "uninstall_mod":
      state.mods = state.mods.filter((m) => m.id !== args?.modId);
      return ok(undefined);
    case "toggle_mod": {
      const target = state.mods.find((m) => m.id === args?.modId);
      if (target) target.enabled = Boolean(args?.enabled);
      return ok(undefined);
    }
    case "get_mod_thumbnail":
      return ok(null);
    case "get_storage_directory":
      return ok("C:/Users/you/AppData/Roaming/dev.leaguetoolkit.manager/mods");
    case "reorder_mods": {
      const order = (args?.modIds as string[] | undefined) ?? [];
      state.mods = order
        .map((id) => state.mods.find((m) => m.id === id))
        .filter((m): m is InstalledMod => !!m);
      return ok(undefined);
    }
    case "get_all_mod_wad_reports":
      return ok({});
    case "get_linked_bin_offenders":
      return ok({});

    case "get_patcher_status":
      return ok(state.patcherStatus);
    case "start_patcher":
      state.patcherStatus = { running: true, overlayPrefix: "mock", phase: "patching" };
      return ok(undefined);
    case "stop_patcher":
      state.patcherStatus = { running: false, overlayPrefix: null, phase: "idle" };
      return ok(undefined);
    case "is_league_running":
      return ok(launchAvailability.leagueRunning);

    case "get_launch_availability":
      return ok(launchAvailability);
    case "launch_league":
      return ok(null);

    case "list_mod_profiles":
      return ok(state.profiles);
    case "get_active_mod_profile":
      return ok(state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0]);
    case "create_mod_profile": {
      const profile: Profile = {
        id: `mock-profile-${nextId++}`,
        name: String(args?.name ?? "New Profile"),
        slug: String(args?.name ?? "new-profile").toLowerCase(),
        enabledMods: [],
        modOrder: [],
        layerStates: {},
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
      };
      state.profiles.push(profile);
      return ok(profile);
    }
    case "switch_mod_profile":
      state.activeProfileId = String(args?.profileId ?? state.activeProfileId);
      return ok(state.profiles.find((p) => p.id === state.activeProfileId));

    case "get_folders":
      return ok(state.folders);
    case "get_folder_order":
      return ok(state.folders.map((f) => f.id));
    case "create_folder": {
      const folder: LibraryFolder = {
        id: `mock-folder-${nextId++}`,
        name: String(args?.name ?? "New Folder"),
        modIds: [],
      };
      state.folders.push(folder);
      return ok(folder);
    }
    case "move_mod_to_folder": {
      const modId = String(args?.modId);
      const folderId = args?.folderId as string | null;
      for (const f of state.folders) f.modIds = f.modIds.filter((id) => id !== modId);
      if (folderId) state.folders.find((f) => f.id === folderId)?.modIds.push(modId);
      const targetMod = state.mods.find((m) => m.id === modId);
      if (targetMod) targetMod.folderId = folderId;
      return ok(undefined);
    }

    case "run_diagnostics":
      return ok(diagnosticReport);

    case "get_workshop_projects":
      return ok(state.workshopProjects);

    default:
      console.warn(`[web mock] unhandled invoke("${cmd}") - returning undefined`, args);
      return ok(undefined);
  }
}
