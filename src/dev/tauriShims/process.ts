export async function relaunch(): Promise<void> {
  console.warn("[web mock] relaunch() is a no-op in the browser preview");
}

export async function exit(): Promise<void> {
  console.warn("[web mock] exit() is a no-op in the browser preview");
}
