
export const OPEN_PALETTE = "open-palette";

declare global {
  interface DocumentEventMap {
    [OPEN_PALETTE]: CustomEvent;
  }
}
