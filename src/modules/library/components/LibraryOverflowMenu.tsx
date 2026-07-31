import { CheckCheck, EllipsisVertical, X } from "lucide-react";

import { IconButton, Menu, Tooltip } from "@/components";
import type { InstalledMod } from "@/lib/tauri";
import type { useLibraryActions } from "@/modules/library/api";

import { AnalyzeUncategorizedButton } from "./AnalyzeUncategorizedButton";

interface LibraryOverflowMenuProps {
  actions: ReturnType<typeof useLibraryActions>;
  visibleMods: InstalledMod[];
  disabled: boolean;
}

/** Secondary/bulk actions that don't need to be a single click away, tucked
 * behind the toolbar's overflow trigger to keep the primary row scannable. */
export function LibraryOverflowMenu({ actions, visibleMods, disabled }: LibraryOverflowMenuProps) {
  const visibleEnabledCount = visibleMods.reduce((n, m) => n + (m.enabled ? 1 : 0), 0);
  const canEnableAll = visibleMods.length > 0 && visibleEnabledCount < visibleMods.length;
  const canDisableAll = visibleEnabledCount > 0;
  const bulkDisabled = disabled || actions.toggleMod.isPending;

  return (
    <Menu.Root>
      <Tooltip content="More actions">
        <Menu.Trigger
          render={
            <IconButton
              icon={<EllipsisVertical className="h-4 w-4" />}
              variant="ghost"
              size="sm"
              aria-label="More actions"
            />
          }
        />
      </Tooltip>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item
              icon={<CheckCheck className="h-4 w-4" />}
              onClick={() => actions.handleSetEnabledForMods(visibleMods, true)}
              disabled={bulkDisabled || !canEnableAll}
            >
              Enable all visible
            </Menu.Item>
            <Menu.Item
              icon={<X className="h-4 w-4" />}
              onClick={() => actions.handleSetEnabledForMods(visibleMods, false)}
              disabled={bulkDisabled || !canDisableAll}
            >
              Disable all visible
            </Menu.Item>
            <Menu.Separator />
            <AnalyzeUncategorizedButton disabled={disabled} />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
