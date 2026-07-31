type UnlistenFn = () => void;

/** Stands in for the real WebView window in the browser preview: window-chrome
 * controls (maximize/close) are no-ops since there's no native window to
 * drive, and drag/drop never fires since the browser has its own. */
function mockWindow() {
  return {
    isMaximized: async () => false,
    toggleMaximize: async () => {},
    minimize: async () => {},
    close: async () => {},
    show: async () => {},
    setFocus: async () => {},
    onResized: async (): Promise<UnlistenFn> => () => {},
    onDragDropEvent: async (): Promise<UnlistenFn> => () => {},
  };
}

export function getCurrentWindow() {
  return mockWindow();
}
