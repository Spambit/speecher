export function createInstanceWithConstructor<T extends I, I>(
  c: new () => T,
  o: I
): T {
  const obj = new c();
  const keys = Object.keys(o);
  for (const key of keys) {
    obj[key] = o[key];
  }
  return obj;
}

export function createInstance<T extends I, I>(className: string, o: I): T {
  const obj = Object.create(window[className].prototype);
  if (!obj.constructor) {
    throw new TypeError("No constructor found.");
  }

  obj.constructor.apply(obj);
  const keys = Object.keys(o);
  for (const key of keys) {
    obj[key] = o[key];
  }
  return obj;
}

export function clone<T>(obj: T): T {
  const cloneObj = new (<any>this.constructor())();
  for (const attr in obj) {
    if (typeof obj[attr] === "object") {
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

export function create<T>(c: { new (): T }): T {
  return new c();
}
