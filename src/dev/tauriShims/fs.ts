/** No real filesystem in a browser tab. Call sites that reach these already
 * gate on a path coming back from the (also-mocked, always-null) dialog
 * `open()`/`save()`, so these mostly exist to keep imports resolvable. */
export async function readTextFile(_path: string): Promise<string> {
  return "";
}

export async function writeTextFile(_path: string, _data: string): Promise<void> {}
