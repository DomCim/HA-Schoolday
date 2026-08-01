/** Dispatch the bubbling, composed CustomEvent the Lovelace editor expects. */
export function fireEvent<T>(node: HTMLElement, type: string, detail?: T): void {
  node.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );
}
