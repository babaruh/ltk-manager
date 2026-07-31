export const patcherKeys = {
  status: () => ["patcher", "status"] as const,
  leagueRunning: () => ["patcher", "league-running"] as const,
};
