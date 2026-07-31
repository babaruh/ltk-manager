/** No updater in the browser preview - always reports "up to date". */
export async function check(): Promise<null> {
  return null;
}
