export function createInstanceOfClass<T>(c: new () => T, attrValues: any): T {
  const obj = new c();
  const keys = Object.keys(attrValues);
  for (const key of keys) {
    obj[key] = attrValues[key];
  }
  return obj;
}

export function clone<T>(obj: T): T {
  const cloneObj = new (this.constructor() as any)();
  for (const attr in obj) {
    if (typeof obj[attr] === 'object') {
      cloneObj[attr] = clone(obj[attr]);
    } else {
      cloneObj[attr] = obj[attr];
    }
  }
  return cloneObj;
}

export function setProperty<T, K extends keyof T>(obj: T, key: K, val: any) {
  return (obj[key] = val);
}

export function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

export function create<T>(c: new () => T): T {
  return new c();
}
