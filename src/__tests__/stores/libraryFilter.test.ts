import { useLibraryFilterStore } from "@/stores/libraryFilter";

describe("libraryFilter store", () => {
  beforeEach(() => {
    useLibraryFilterStore.setState({
      selectedTags: new Set(),
      selectedChampions: new Set(),
      selectedMaps: new Set(),
      sort: { field: "priority", direction: "desc" },
    });
    localStorage.clear();
  });

  describe("toggleTag", () => {
    it("adds a tag when not present", () => {
      useLibraryFilterStore.getState().toggleTag("skin");
      expect(useLibraryFilterStore.getState().selectedTags).toEqual(new Set(["skin"]));
    });

    it("removes a tag when already present", () => {
      useLibraryFilterStore.setState({ selectedTags: new Set(["skin"]) });
      useLibraryFilterStore.getState().toggleTag("skin");
      expect(useLibraryFilterStore.getState().selectedTags).toEqual(new Set());
    });
  });

  describe("toggleChampion", () => {
    it("adds a champion when not present", () => {
      useLibraryFilterStore.getState().toggleChampion("Ahri");
      expect(useLibraryFilterStore.getState().selectedChampions).toEqual(new Set(["Ahri"]));
    });

    it("removes a champion when already present", () => {
      useLibraryFilterStore.setState({ selectedChampions: new Set(["Ahri"]) });
      useLibraryFilterStore.getState().toggleChampion("Ahri");
      expect(useLibraryFilterStore.getState().selectedChampions).toEqual(new Set());
    });
  });

  describe("toggleMap", () => {
    it("adds a map when not present", () => {
      useLibraryFilterStore.getState().toggleMap("SR");
      expect(useLibraryFilterStore.getState().selectedMaps).toEqual(new Set(["SR"]));
    });

    it("removes a map when already present", () => {
      useLibraryFilterStore.setState({ selectedMaps: new Set(["SR"]) });
      useLibraryFilterStore.getState().toggleMap("SR");
      expect(useLibraryFilterStore.getState().selectedMaps).toEqual(new Set());
    });
  });

  describe("setTags / setChampions / setMaps", () => {
    it("replaces selected tags", () => {
      useLibraryFilterStore.getState().setTags(new Set(["a", "b"]));
      expect(useLibraryFilterStore.getState().selectedTags).toEqual(new Set(["a", "b"]));
    });

    it("replaces selected champions", () => {
      useLibraryFilterStore.getState().setChampions(new Set(["Ahri", "Zed"]));
      expect(useLibraryFilterStore.getState().selectedChampions).toEqual(new Set(["Ahri", "Zed"]));
    });

    it("replaces selected maps", () => {
      useLibraryFilterStore.getState().setMaps(new Set(["SR"]));
      expect(useLibraryFilterStore.getState().selectedMaps).toEqual(new Set(["SR"]));
    });
  });

  describe("clearFilters", () => {
    it("clears all filter sets", () => {
      useLibraryFilterStore.setState({
        selectedTags: new Set(["skin"]),
        selectedChampions: new Set(["Ahri"]),
        selectedMaps: new Set(["SR"]),
      });
      useLibraryFilterStore.getState().clearFilters();
      const state = useLibraryFilterStore.getState();
      expect(state.selectedTags.size).toBe(0);
      expect(state.selectedChampions.size).toBe(0);
      expect(state.selectedMaps.size).toBe(0);
    });

    it("does not reset sort config", () => {
      useLibraryFilterStore.setState({ sort: { field: "name", direction: "asc" } });
      useLibraryFilterStore.getState().clearFilters();
      expect(useLibraryFilterStore.getState().sort).toEqual({ field: "name", direction: "asc" });
    });
  });

  describe("setSort", () => {
    it("updates sort config", () => {
      useLibraryFilterStore.getState().setSort({ field: "name", direction: "asc" });
      expect(useLibraryFilterStore.getState().sort).toEqual({ field: "name", direction: "asc" });
    });
  });

  describe("persistence", () => {
    it("persists sort and filters to localStorage under ltk-library-filter key", () => {
      useLibraryFilterStore.getState().setSort({ field: "name", direction: "asc" });
      useLibraryFilterStore.getState().setTags(new Set(["skin"]));

      const stored = localStorage.getItem("ltk-library-filter");
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.state.sort).toEqual({ field: "name", direction: "asc" });
      expect(parsed.state.selectedTags).toEqual(["skin"]);
    });

    it("rehydrates Set fields from a persisted array", () => {
      localStorage.setItem(
        "ltk-library-filter",
        JSON.stringify({
          version: 0,
          state: {
            selectedTags: ["skin"],
            selectedChampions: ["Ahri"],
            selectedMaps: ["SR"],
            showOnlyEnabled: true,
            sort: { field: "installedAt", direction: "desc" },
          },
        }),
      );

      useLibraryFilterStore.persist.rehydrate();

      const state = useLibraryFilterStore.getState();
      expect(state.selectedTags).toEqual(new Set(["skin"]));
      expect(state.selectedChampions).toEqual(new Set(["Ahri"]));
      expect(state.selectedMaps).toEqual(new Set(["SR"]));
      expect(state.showOnlyEnabled).toBe(true);
      expect(state.sort).toEqual({ field: "installedAt", direction: "desc" });
    });
  });
});
