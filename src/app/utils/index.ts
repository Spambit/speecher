export * from './object.util';

export type anyfn = (...args: any[]) => any;
export const defer = (fn: anyfn) => {
  window.setTimeout(fn, 0);
};
