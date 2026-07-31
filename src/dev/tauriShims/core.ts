import { mockInvoke } from "@/dev/webMock/invoke";

export async function invoke(cmd: string, args?: Record<string, unknown>) {
  return mockInvoke(cmd, args);
}

/** Real file paths aren't loadable in a browser tab - returning "" makes
 * every thumbnail fall back to the app's own letter-placeholder UI instead of
 * a broken `<img>` icon. */
export function convertFileSrc(): string {
  return "";
}
