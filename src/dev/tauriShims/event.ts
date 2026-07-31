export type UnlistenFn = () => void;

/** No real backend events fire in the browser preview - resolve to a no-op
 * unsubscribe so effect cleanup still works. */
export async function listen<T>(
  _event: string,
  _handler: (event: { payload: T }) => void,
): Promise<UnlistenFn> {
  return () => {};
}
