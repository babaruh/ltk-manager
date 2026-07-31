import { useQuery } from "@tanstack/react-query";

import { api, type AppError } from "@/lib/tauri";
import { queryFn } from "@/utils/query";

import { patcherKeys } from "./keys";

/** Polls whether League currently appears to be running, so callers can react
 * to it starting outside the manager's own launch flow. Only polls while
 * `enabled` — process enumeration is wasted work when nothing needs it. */
export function useIsLeagueRunning(enabled: boolean) {
  return useQuery<boolean, AppError>({
    queryKey: patcherKeys.leagueRunning(),
    queryFn: queryFn(api.isLeagueRunning),
    refetchInterval: 3000,
    enabled,
  });
}
