/** Real `http(s)` links (Discord, GitHub, ...) genuinely work via a new tab;
 * anything else (a local file/folder path) has nowhere to open to. */
export async function open(target: string): Promise<void> {
  if (/^https?:\/\//i.test(target)) {
    window.open(target, "_blank", "noopener,noreferrer");
    return;
  }
  console.warn(`[web mock] can't open local path in browser: ${target}`);
}
