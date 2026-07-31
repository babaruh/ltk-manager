import { ShieldAlert } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { match } from "ts-pattern";

import { Checkbox, Tooltip } from "@/components";

import { LayerPopover } from "../LayerPopover";
import { MissingDepsBadge } from "../MissingDepsBadge";
import { WadCountBadge } from "../WadCountBadge";
import {
  ModCardMenu,
  ModCardThumbnail,
  ModCardToggle,
  ModPills,
  SkinhackInfoDialog,
} from "./ModCardParts";
import type { ModCardView } from "./useModCardController";

export function ModCardGrid({ view }: { view: ModCardView }) {
  const {
    mod,
    thumbnailUrl,
    isFlagged,
    skinhackReason,
    isMultiLayer,
    selectMode,
    isSelected,
    inSelectedState,
    inEnabledState,
    cursorClass,
    skinhackInfoOpen,
    setSkinhackInfoOpen,
    onCardClick,
    onCheckboxClick,
  } = view;

  const stateClass = match({ isSelected: inSelectedState, isEnabled: inEnabledState })
    .with({ isSelected: true }, () => "bg-surface-800")
    .with({ isEnabled: true }, () => "bg-surface-900 hover:bg-surface-800/70")
    .otherwise(() => "bg-transparent hover:bg-surface-800/50");

  return (
    <div
      onClick={onCardClick}
      className={twMerge(
        "group relative flex h-full flex-col rounded-lg transition-colors duration-150 ease-out",
        cursorClass,
        stateClass,
      )}
    >
      <div
        className="absolute top-2 left-2 z-10"
        data-no-toggle
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          size="md"
          checked={isSelected}
          onCheckedChange={onCheckboxClick}
          tabIndex={-1}
          aria-label={`Select ${mod.displayName}`}
          className={twMerge(
            "backdrop-blur-sm transition-opacity",
            !selectMode && !isSelected && "opacity-60 hover:opacity-100",
          )}
        />
      </div>
      <div
        className="absolute top-2 right-2 z-10"
        data-no-toggle
        onClick={(e) => e.stopPropagation()}
      >
        <ModCardToggle variant="grid" view={view} />
      </div>

      {isFlagged && (
        <Tooltip content={skinhackReason}>
          <div className="absolute top-2 left-9 z-10 rounded-md bg-red-500/90 p-1">
            <ShieldAlert className="h-4 w-4 text-white" />
          </div>
        </Tooltip>
      )}

      <ModCardThumbnail variant="grid" thumbnailUrl={thumbnailUrl} displayName={mod.displayName} />

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex items-center gap-1">
          <h3 className="line-clamp-1 text-sm font-medium text-surface-100">{mod.displayName}</h3>
          {isFlagged && <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-red-500" />}
        </div>

        <div className="mb-1 flex min-h-5 items-center gap-1">
          <ModPills mod={mod} max={3} />
          {isMultiLayer && <LayerPopover mod={mod} disabled={view.interactionsDisabled} />}
          <span data-no-toggle onClick={(e) => e.stopPropagation()}>
            <WadCountBadge modId={mod.id} />
          </span>
          <span data-no-toggle onClick={(e) => e.stopPropagation()}>
            <MissingDepsBadge modId={mod.id} enabled={mod.enabled} />
          </span>
        </div>

        <div className="mt-auto flex items-center text-xs text-surface-500">
          <span>v{mod.version}</span>
          <span className="mx-1">•</span>
          <span className="flex-1 truncate">
            {mod.authors.length > 0 ? mod.authors[0] : "Unknown"}
          </span>
          <div className="ml-1 shrink-0" data-no-toggle onClick={(e) => e.stopPropagation()}>
            <ModCardMenu view={view} />
          </div>
        </div>
      </div>
      <SkinhackInfoDialog open={skinhackInfoOpen} onOpenChange={setSkinhackInfoOpen} />
    </div>
  );
}
