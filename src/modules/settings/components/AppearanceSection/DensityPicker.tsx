import { Button } from "@/components";
import type { ZoomLevel } from "@/stores";
import { useSetZoomLevel, useZoomLevel } from "@/stores";

const DENSITY_OPTIONS: { value: ZoomLevel; label: string; description: string }[] = [
  { value: 70, label: "Ultra Compact", description: "Tightest spacing, most rows on screen" },
  { value: 90, label: "Compact", description: "Denser than default" },
  { value: 100, label: "Comfortable", description: "Default spacing" },
];

export function DensityPicker() {
  const zoomLevel = useZoomLevel();
  const setZoomLevel = useSetZoomLevel();

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-surface-200">Density</span>

      <div className="flex gap-2">
        {DENSITY_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={zoomLevel === option.value ? "filled" : "default"}
            size="sm"
            onClick={() => setZoomLevel(option.value)}
            title={option.description}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
