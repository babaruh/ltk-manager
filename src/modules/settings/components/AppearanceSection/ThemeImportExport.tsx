import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { Download, Upload } from "lucide-react";
import { z } from "zod";

import { Button, useToast } from "@/components";
import type { Settings } from "@/lib/tauri";

interface ThemeImportExportProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
}

const themePresetSchema = z.object({
  theme: z.enum(["system", "dark", "light"]),
  accentColor: z.object({
    preset: z.string().nullable(),
    customHue: z.number().nullable(),
  }),
  backdropImage: z.string().nullable(),
  backdropBlur: z.number().nullable(),
});

export function ThemeImportExport({ settings, onSave }: ThemeImportExportProps) {
  const toast = useToast();

  async function handleExport() {
    try {
      const path = await save({
        title: "Export Theme",
        defaultPath: "ltk-theme.json",
        filters: [{ name: "Theme", extensions: ["json"] }],
      });
      if (!path) return;

      const preset = {
        theme: settings.theme,
        accentColor: settings.accentColor,
        backdropImage: settings.backdropImage,
        backdropBlur: settings.backdropBlur,
      };
      await writeTextFile(path, JSON.stringify(preset, null, 2));
      toast.success("Theme exported");
    } catch (error) {
      toast.error("Failed to export theme", error instanceof Error ? error.message : String(error));
    }
  }

  async function handleImport() {
    try {
      const path = await open({
        title: "Import Theme",
        filters: [{ name: "Theme", extensions: ["json"] }],
      });
      if (!path) return;

      const contents = await readTextFile(path as string);
      const parsed = themePresetSchema.parse(JSON.parse(contents));

      onSave({
        ...settings,
        theme: parsed.theme,
        accentColor: parsed.accentColor,
        backdropImage: parsed.backdropImage,
        backdropBlur: parsed.backdropBlur,
      });
      toast.success("Theme imported");
    } catch (error) {
      toast.error(
        "Failed to import theme",
        error instanceof z.ZodError
          ? "The selected file isn't a valid theme file."
          : error instanceof Error
            ? error.message
            : String(error),
      );
    }
  }

  return (
    <div className="space-y-3">
      <span className="block text-sm font-medium text-surface-400">Custom Theme</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          left={<Download className="h-4 w-4" />}
        >
          Export Theme
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleImport}
          left={<Upload className="h-4 w-4" />}
        >
          Import Theme
        </Button>
      </div>
      <p className="text-sm text-surface-500">
        Save the current theme, accent color, and background to a JSON file, or load one someone
        else shared with you.
      </p>
    </div>
  );
}
