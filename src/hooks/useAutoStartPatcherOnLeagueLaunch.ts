import { useEffect, useRef } from "react";

import { useGuardedStartPatcher, useIsLeagueRunning, usePatcherStatus } from "@/modules/patcher";
import { useSettings } from "@/modules/settings";

import { useHddWarning } from "./useHddWarning";

/**
 * Starts the patcher the moment League appears to launch, even when it wasn't
 * started through this manager's own Play button (e.g. from the Riot Client
 * or a desktop shortcut).
 *
 * Edge-triggered on the not-running -> running transition so it fires once
 * per launch instead of on every poll while League stays open, and skips
 * entirely if the patcher is already running.
 */
export function useAutoStartPatcherOnLeagueLaunch() {
  const { data: settings } = useSettings();
  const enabled = settings?.autoStartPatcherOnLeagueLaunch ?? false;

  const { data: isLeagueRunning } = useIsLeagueRunning(enabled);
  const { data: patcherStatus } = usePatcherStatus();
  const { start: guardedStart } = useGuardedStartPatcher();
  const maybeShowHddWarning = useHddWarning();

  const guardedStartRef = useRef(guardedStart);
  guardedStartRef.current = guardedStart;

  const maybeShowHddWarningRef = useRef(maybeShowHddWarning);
  maybeShowHddWarningRef.current = maybeShowHddWarning;

  const wasRunningRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      wasRunningRef.current = false;
      return;
    }
    if (isLeagueRunning === undefined) return;

    const wasRunning = wasRunningRef.current;
    wasRunningRef.current = isLeagueRunning;

    if (!wasRunning && isLeagueRunning && !patcherStatus?.running) {
      (async () => {
        await maybeShowHddWarningRef.current();
        await guardedStartRef.current({});
      })();
    }
  }, [enabled, isLeagueRunning, patcherStatus?.running]);
}
