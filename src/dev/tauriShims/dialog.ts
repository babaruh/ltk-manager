interface DialogOptions {
  [key: string]: unknown;
}

/** No native file picker in a browser tab - always resolves to "cancelled"
 * so call sites' existing `if (!path) return;` guards handle it cleanly. */
export async function open(_options?: DialogOptions): Promise<string | null> {
  console.warn("[web mock] file dialogs aren't available in the browser preview");
  return null;
}

export async function save(_options?: DialogOptions): Promise<string | null> {
  console.warn("[web mock] file dialogs aren't available in the browser preview");
  return null;
}

export async function message(msg: string): Promise<void> {
  window.alert(msg);
}

export async function ask(msg: string): Promise<boolean> {
  return window.confirm(msg);
}

export async function confirm(msg: string): Promise<boolean> {
  return window.confirm(msg);
}
