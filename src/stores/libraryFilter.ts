import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SortField = "priority" | "name" | "installedAt" | "enabled";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface LibraryFilterStore {
  selectedTags: Set<string>;
  selectedChampions: Set<string>;
  selectedMaps: Set<string>;
  showOnlyEnabled: boolean;
  sort: SortConfig;

  toggleTag: (tag: string) => void;
  toggleChampion: (champion: string) => void;
  toggleMap: (map: string) => void;
  setTags: (tags: Set<string>) => void;
  setChampions: (champions: Set<string>) => void;
  setMaps: (maps: Set<string>) => void;
  clearFilters: () => void;
  setShowOnlyEnabled: (show: boolean) => void;
  setSort: (sort: SortConfig) => void;
}

export const useLibraryFilterStore = create<LibraryFilterStore>()(
  persist(
    (set) => ({
      selectedTags: new Set(),
      selectedChampions: new Set(),
      selectedMaps: new Set(),
      showOnlyEnabled: false,
      sort: { field: "priority", direction: "desc" },

      toggleTag: (tag) =>
        set((state) => {
          const next = new Set(state.selectedTags);
          if (next.has(tag)) next.delete(tag);
          else next.add(tag);
          return { selectedTags: next };
        }),

      toggleChampion: (champion) =>
        set((state) => {
          const next = new Set(state.selectedChampions);
          if (next.has(champion)) next.delete(champion);
          else next.add(champion);
          return { selectedChampions: next };
        }),

      toggleMap: (map) =>
        set((state) => {
          const next = new Set(state.selectedMaps);
          if (next.has(map)) next.delete(map);
          else next.add(map);
          return { selectedMaps: next };
        }),

      setTags: (tags) => set({ selectedTags: new Set(tags) }),
      setChampions: (champions) => set({ selectedChampions: new Set(champions) }),
      setMaps: (maps) => set({ selectedMaps: new Set(maps) }),

      clearFilters: () =>
        set({
          selectedTags: new Set(),
          selectedChampions: new Set(),
          selectedMaps: new Set(),
          showOnlyEnabled: false,
        }),

      setShowOnlyEnabled: (show) => set({ showOnlyEnabled: show }),
      setSort: (sort) => set({ sort }),
    }),
    {
      name: "ltk-library-filter",
      partialize: (state) => ({
        selectedTags: state.selectedTags,
        selectedChampions: state.selectedChampions,
        selectedMaps: state.selectedMaps,
        showOnlyEnabled: state.showOnlyEnabled,
        sort: state.sort,
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          const state = parsed?.state;
          if (state) {
            state.selectedTags = new Set(state.selectedTags ?? []);
            state.selectedChampions = new Set(state.selectedChampions ?? []);
            state.selectedMaps = new Set(state.selectedMaps ?? []);
          }
          return parsed;
        },
        setItem: (name, value) => {
          const serializable = {
            ...value,
            state: {
              ...value.state,
              selectedTags: [...(value.state.selectedTags ?? [])],
              selectedChampions: [...(value.state.selectedChampions ?? [])],
              selectedMaps: [...(value.state.selectedMaps ?? [])],
            },
          };
          localStorage.setItem(name, JSON.stringify(serializable));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);

export function useHasActiveFilters() {
  return useLibraryFilterStore(
    (s) =>
      s.selectedTags.size > 0 ||
      s.selectedChampions.size > 0 ||
      s.selectedMaps.size > 0 ||
      s.showOnlyEnabled,
  );
}

/** Reordering only applies in priority sort; any other sort imposes its own order. */
export function useReorderDisabled() {
  return useLibraryFilterStore((s) => s.sort.field !== "priority");
}
