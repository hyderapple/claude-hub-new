// Shared debug logging utility
// Enable via: DEBUG=claude-hub-new or DEBUG=*

const DEBUG = process.env.DEBUG?.includes('claude-hub-new') || process.env.DEBUG === '*';

/**
 * Create a namespaced debug logger
 * @param namespace - Tag for log messages (e.g., 'config', 'usage')
 */
export function createDebug(namespace: string) {
  return function debug(msg: string, ...args: unknown[]): void {
    if (DEBUG) {
      console.error(`[claude-hub-new:${namespace}] ${msg}`, ...args);
    }
  };
}
