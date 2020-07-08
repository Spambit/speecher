export * from "./object.util";

export type anyfn = (...args: any[]) => any;
export function defer(fn: anyfn) {
  setTimeout(fn, 0);
}
